from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.database import SessionLocal
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _get_db():
    return SessionLocal()


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    for field in ("email", "password", "full_name"):
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    db = _get_db()
    try:
        if db.query(User).filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 409
        user = User(email=data["email"], full_name=data["full_name"])
        user.set_password(data["password"])
        db.add(user)
        db.commit()
        db.refresh(user)
        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": user.to_dict()}), 201
    finally:
        db.close()


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    db = _get_db()
    try:
        user = db.query(User).filter_by(email=data["email"]).first()
        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401
        if not user.is_active:
            return jsonify({"error": "Account disabled"}), 403
        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": user.to_dict()})
    finally:
        db.close()


@auth_bp.get("/me")
@jwt_required()
def me():
    db = _get_db()
    try:
        user = db.get(User, get_jwt_identity())
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    finally:
        db.close()
