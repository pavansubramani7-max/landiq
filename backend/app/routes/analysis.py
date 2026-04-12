from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import SessionLocal
from app.models.land_parcel import LandParcel
from app.models.prediction_result import PredictionResult, RiskLevel, Recommendation
from modules.valuation import predict_value
from modules.risk_analysis import analyze_risk
from modules.fraud_detection import detect_fraud
from modules.forecasting import forecast_prices
from modules.legal_intel import parse_document
from modules.report_gen import generate_report
import os

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/analysis")


def _get_db():
    return SessionLocal()


def _map_risk_level(level_str: str) -> RiskLevel:
    return {"LOW": RiskLevel.low, "MEDIUM": RiskLevel.medium}.get(level_str.upper(), RiskLevel.high)


def _map_recommendation(fraud, risk_score, diff_pct) -> Recommendation:
    if fraud["fraud_detected"] or risk_score > 70:
        return Recommendation.avoid
    if diff_pct > 20:
        return Recommendation.hold
    return Recommendation.buy


def _build_ml_input(parcel: LandParcel, extra: dict) -> dict:
    return {
        "area_sqft": parcel.area_sqft,
        "city": parcel.city,
        "state": parcel.state,
        "zone": parcel.land_type.value,
        "infrastructure": extra.get("infrastructure", "average"),
        "asking_price": parcel.quoted_price,
        "distance_highway_km": parcel.dist_highway_km or 5,
        "distance_city_center_km": extra.get("distance_city_center_km", 10),
        "distance_water_km": extra.get("distance_water_km", 5),
        "ownership_changes": parcel.num_ownership_changes,
        "years_held": extra.get("years_held", 1),
        "legal_disputes": parcel.pending_litigations.value != "none",
        "flood_zone": parcel.flood_zone_risk.value == "high",
    }


@analysis_bp.post("/parcel/<parcel_id>")
@jwt_required()
def analyze_parcel(parcel_id):
    db = _get_db()
    try:
        parcel = db.get(LandParcel, parcel_id)
        if not parcel:
            return jsonify({"error": "Parcel not found"}), 404

        extra = request.get_json() or {}
        ml_input = _build_ml_input(parcel, extra)

        doc_path = extra.pop("_doc_path", None)
        legal = parse_document(doc_path, ml_input) if doc_path else {"status": "no_document"}

        valuation = predict_value(ml_input)
        risk = analyze_risk(ml_input, valuation)
        fraud = detect_fraud(ml_input, valuation)
        forecast = forecast_prices(ml_input)

        estimated = valuation["estimated_value"]
        diff_pct = ((parcel.quoted_price - estimated) / estimated * 100) if estimated else 0
        rec = _map_recommendation(fraud, risk["risk_score"], diff_pct)

        series = forecast.get("series", [])
        forecast_1yr = series[1]["total_value"] if len(series) > 1 else None
        forecast_3yr = series[3]["total_value"] if len(series) > 3 else None

        result = PredictionResult(
            parcel_id=parcel_id,
            user_id=get_jwt_identity(),
            estimated_value=estimated,
            confidence_interval=valuation.get("confidence_pct"),
            risk_score=risk["risk_score"],
            risk_level=_map_risk_level(risk["risk_level"]),
            fraud_probability=min(1.0, fraud["signal_count"] / 5),
            investment_score=max(0, 100 - risk["risk_score"]),
            recommendation=rec,
            shap_values=risk.get("breakdown"),
            forecast_1yr=forecast_1yr,
            forecast_3yr=forecast_3yr,
            model_version="1.0.0",
        )
        db.add(result)
        db.commit()
        db.refresh(result)

        return jsonify({
            "prediction_id": result.id,
            "parcel_id": parcel_id,
            "valuation": valuation,
            "risk": risk,
            "fraud": fraud,
            "forecast": forecast,
            "legal": legal,
            "recommendation": rec.value,
            "asking_vs_estimated_pct": round(diff_pct, 2),
            "investment_score": result.investment_score,
            "fraud_probability": result.fraud_probability,
        })
    finally:
        db.close()


@analysis_bp.get("/parcel/<parcel_id>/history")
@jwt_required()
def parcel_history(parcel_id):
    db = _get_db()
    try:
        results = db.query(PredictionResult).filter_by(parcel_id=parcel_id).all()
        return jsonify([{
            "id": r.id,
            "estimated_value": r.estimated_value,
            "risk_score": r.risk_score,
            "risk_level": r.risk_level.value,
            "recommendation": r.recommendation.value,
            "created_at": r.created_at.isoformat(),
        } for r in results])
    finally:
        db.close()


@analysis_bp.get("/report/<prediction_id>")
@jwt_required()
def get_report(prediction_id):
    db = _get_db()
    try:
        result = db.get(PredictionResult, prediction_id)
        if not result:
            return jsonify({"error": "Prediction not found"}), 404
        parcel = db.get(LandParcel, result.parcel_id)

        report_data = {
            "analysis_id": prediction_id[:8],
            "input": {"city": parcel.city, "state": parcel.state, "area_sqft": parcel.area_sqft,
                      "asking_price": parcel.quoted_price, "zone": parcel.land_type.value},
            "valuation": {"estimated_value": result.estimated_value, "confidence_pct": result.confidence_interval},
            "risk": {"risk_score": result.risk_score, "risk_level": result.risk_level.value,
                     "breakdown": result.shap_values or {}},
            "fraud": {"fraud_detected": result.fraud_probability > 0.4, "signal_count": 0, "signals": []},
            "forecast": {"series": [], "annual_growth_rate_pct": 0},
            "legal": {"status": "no_document"},
            "recommendation": result.recommendation.value,
            "asking_vs_estimated_pct": 0,
        }

        reports_folder = current_app.config["REPORTS_FOLDER"]
        report_path = os.path.join(reports_folder, f"report_{prediction_id[:8]}.pdf")
        generate_report(report_data, report_path)
        return send_file(report_path, as_attachment=True,
                         download_name=f"LandIQ_Report_{prediction_id[:8]}.pdf",
                         mimetype="application/pdf")
    finally:
        db.close()
