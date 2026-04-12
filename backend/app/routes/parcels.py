from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import SessionLocal
from app.models.land_parcel import LandParcel

parcels_bp = Blueprint("parcels", __name__, url_prefix="/api/parcels")

REQUIRED_FIELDS = [
    "survey_number", "state", "district", "city", "pincode",
    "land_type", "area_sqft", "quoted_price", "owner_name",
]


def _get_db():
    return SessionLocal()


def _parcel_to_dict(p: LandParcel) -> dict:
    return {
        "id": p.id,
        "survey_number": p.survey_number,
        "state": p.state,
        "district": p.district,
        "city": p.city,
        "pincode": p.pincode,
        "land_type": p.land_type.value,
        "area_sqft": p.area_sqft,
        "quoted_price": p.quoted_price,
        "owner_name": p.owner_name,
        "num_ownership_changes": p.num_ownership_changes,
        "last_transfer_year": p.last_transfer_year,
        "dist_highway_km": p.dist_highway_km,
        "dist_metro_km": p.dist_metro_km,
        "near_tech_park": p.near_tech_park,
        "flood_zone_risk": p.flood_zone_risk.value,
        "pending_litigations": p.pending_litigations.value,
        "created_by": p.created_by,
        "created_at": p.created_at.isoformat(),
    }


@parcels_bp.get("/")
@jwt_required()
def list_parcels():
    db = _get_db()
    try:
        parcels = db.query(LandParcel).all()
        return jsonify([_parcel_to_dict(p) for p in parcels])
    finally:
        db.close()


@parcels_bp.post("/")
@jwt_required()
def create_parcel():
    data = request.get_json() or {}
    missing = [f for f in REQUIRED_FIELDS if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    db = _get_db()
    try:
        parcel = LandParcel(
            survey_number=data["survey_number"],
            state=data["state"],
            district=data["district"],
            city=data["city"],
            pincode=data["pincode"],
            land_type=data["land_type"],
            area_sqft=float(data["area_sqft"]),
            quoted_price=float(data["quoted_price"]),
            owner_name=data["owner_name"],
            num_ownership_changes=int(data.get("num_ownership_changes", 0)),
            last_transfer_year=data.get("last_transfer_year"),
            dist_highway_km=data.get("dist_highway_km"),
            dist_metro_km=data.get("dist_metro_km"),
            near_tech_park=bool(data.get("near_tech_park", False)),
            flood_zone_risk=data.get("flood_zone_risk", "low"),
            pending_litigations=data.get("pending_litigations", "none"),
            created_by=get_jwt_identity(),
        )
        db.add(parcel)
        db.commit()
        db.refresh(parcel)
        return jsonify(_parcel_to_dict(parcel)), 201
    finally:
        db.close()


@parcels_bp.get("/<parcel_id>")
@jwt_required()
def get_parcel(parcel_id):
    db = _get_db()
    try:
        parcel = db.get(LandParcel, parcel_id)
        if not parcel:
            return jsonify({"error": "Parcel not found"}), 404
        return jsonify(_parcel_to_dict(parcel))
    finally:
        db.close()


@parcels_bp.put("/<parcel_id>")
@jwt_required()
def update_parcel(parcel_id):
    db = _get_db()
    try:
        parcel = db.get(LandParcel, parcel_id)
        if not parcel:
            return jsonify({"error": "Parcel not found"}), 404
        data = request.get_json() or {}
        updatable = [
            "survey_number", "state", "district", "city", "pincode", "land_type",
            "area_sqft", "quoted_price", "owner_name", "num_ownership_changes",
            "last_transfer_year", "dist_highway_km", "dist_metro_km",
            "near_tech_park", "flood_zone_risk", "pending_litigations",
        ]
        for field in updatable:
            if field in data:
                setattr(parcel, field, data[field])
        db.commit()
        db.refresh(parcel)
        return jsonify(_parcel_to_dict(parcel))
    finally:
        db.close()


@parcels_bp.delete("/<parcel_id>")
@jwt_required()
def delete_parcel(parcel_id):
    db = _get_db()
    try:
        parcel = db.get(LandParcel, parcel_id)
        if not parcel:
            return jsonify({"error": "Parcel not found"}), 404
        db.delete(parcel)
        db.commit()
        return jsonify({"message": "Parcel deleted"})
    finally:
        db.close()
