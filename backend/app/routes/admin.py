from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.land_parcel import LandParcel
from app.models.prediction_result import PredictionResult
from app.models.document import Document

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def _get_db():
    return SessionLocal()


def _require_admin(db):
    uid = get_jwt_identity()
    user = db.get(User, uid)
    if not user or user.role not in (UserRole.admin, UserRole.analyst):
        return None, (jsonify({"error": "Forbidden"}), 403)
    return user, None


@admin_bp.get("/stats")
@jwt_required()
def stats():
    db = _get_db()
    try:
        _, err = _require_admin(db)
        if err:
            return err
        return jsonify({
            "total_users": db.query(User).count(),
            "active_users": db.query(User).filter_by(is_active=True).count(),
            "total_parcels": db.query(LandParcel).count(),
            "total_analyses": db.query(PredictionResult).count(),
            "total_documents": db.query(Document).count(),
        })
    finally:
        db.close()


@admin_bp.get("/users")
@jwt_required()
def list_users():
    db = _get_db()
    try:
        _, err = _require_admin(db)
        if err:
            return err
        users = db.query(User).all()
        return jsonify([u.to_dict() for u in users])
    finally:
        db.close()


@admin_bp.patch("/users/<user_id>")
@jwt_required()
def update_user(user_id):
    db = _get_db()
    try:
        _, err = _require_admin(db)
        if err:
            return err
        user = db.get(User, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        data = request.get_json() or {}
        if "is_active" in data:
            user.is_active = bool(data["is_active"])
        if "role" in data and data["role"] in ("user", "analyst", "admin"):
            user.role = UserRole(data["role"])
        db.commit()
        return jsonify(user.to_dict())
    finally:
        db.close()


@admin_bp.get("/analyses")
@jwt_required()
def list_analyses():
    db = _get_db()
    try:
        _, err = _require_admin(db)
        if err:
            return err
        results = db.query(PredictionResult).order_by(
            PredictionResult.created_at.desc()
        ).limit(100).all()
        return jsonify([{
            "id": r.id,
            "parcel_id": r.parcel_id,
            "user_id": r.user_id,
            "estimated_value": r.estimated_value,
            "risk_score": r.risk_score,
            "risk_level": r.risk_level.value,
            "recommendation": r.recommendation.value,
            "fraud_probability": r.fraud_probability,
            "created_at": r.created_at.isoformat(),
        } for r in results])
    finally:
        db.close()
