import os
from datetime import timedelta
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from prometheus_flask_exporter import PrometheusMetrics
from dotenv import load_dotenv

load_dotenv()

from app.config import Config
from app.database import init_db
from app.routes import auth_bp, parcels_bp, analysis_bp, documents_bp, admin_bp

from modules.valuation import predict_value
from modules.risk_analysis import analyze_risk
from modules.fraud_detection import detect_fraud
from modules.forecasting import forecast_prices
from modules.legal_intel import parse_document
from modules.report_gen import generate_report
import uuid

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=Config.JWT_ACCESS_TOKEN_EXPIRES)

JWTManager(app)

# Prometheus metrics — exposes /metrics endpoint
metrics = PrometheusMetrics(app, default_labels={'app': 'landiq', 'version': '2.0.0'})
metrics.info('landiq_app_info', 'LandIQ Application Info', version='2.0.0')

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "60 per hour"],
    storage_uri="memory://",
)

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
os.makedirs(app.config["REPORTS_FOLDER"], exist_ok=True)

app.register_blueprint(auth_bp)
app.register_blueprint(parcels_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(documents_bp)
app.register_blueprint(admin_bp)

with app.app_context():
    init_db()

_analysis_store = {}


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "version": "2.0.0"})


@app.post("/api/analyze")
@limiter.limit("30 per hour")
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ["area_sqft", "zone", "infrastructure", "asking_price"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    # Support both 'locality' and 'city' field names
    if not data.get('city') and data.get('locality'):
        data['city'] = data['locality']
    if not data.get('locality') and data.get('city'):
        data['locality'] = data['city']

    doc_path = data.pop("_doc_path", None)
    legal = parse_document(doc_path, data) if doc_path else {"status": "no_document"}

    valuation = predict_value(data)
    risk = analyze_risk(data, valuation)
    fraud = detect_fraud(data, valuation)
    forecast = forecast_prices(data)

    estimated = valuation["estimated_value"]
    asking = data["asking_price"]
    diff_pct = ((asking - estimated) / estimated) * 100

    if fraud["fraud_detected"]:
        recommendation = "AVOID — Fraud signals detected. Do not proceed."
    elif risk["risk_score"] > 70:
        recommendation = "HIGH RISK — Proceed only with full legal due diligence."
    elif diff_pct > 20:
        recommendation = "OVERPRICED — Negotiate down or walk away."
    elif diff_pct < -15:
        recommendation = "GOOD DEAL — Below market value. Verify legal status."
    else:
        recommendation = "FAIR DEAL — Price aligns with market. Standard due diligence advised."

    analysis_id = str(uuid.uuid4())[:8]
    result = {
        "analysis_id": analysis_id,
        "input": data,
        "valuation": valuation,
        "risk": risk,
        "fraud": fraud,
        "forecast": forecast,
        "legal": legal,
        "recommendation": recommendation,
        "asking_vs_estimated_pct": round(diff_pct, 2),
    }
    _analysis_store[analysis_id] = result
    return jsonify(result)


@app.post("/api/upload-doc")
@limiter.limit("20 per hour")
def upload_doc():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "Empty filename"}), 400
    ext = os.path.splitext(f.filename)[1].lower()
    if ext not in {".txt", ".pdf", ".png", ".jpg", ".jpeg"}:
        return jsonify({"error": "Unsupported file type"}), 400
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    f.save(path)
    return jsonify({"file_path": path, "status": "uploaded"})


@app.get("/api/report/<analysis_id>")
def get_report(analysis_id):
    if analysis_id not in _analysis_store:
        return jsonify({"error": "Analysis not found"}), 404
    result = _analysis_store[analysis_id]
    report_path = os.path.join(app.config["REPORTS_FOLDER"], f"report_{analysis_id}.pdf")
    generate_report(result, report_path)
    return send_file(report_path, as_attachment=True,
                     download_name=f"LandIQ_Report_{analysis_id}.pdf",
                     mimetype="application/pdf")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
