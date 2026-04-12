import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app.database import SessionLocal
from app.models.document import Document, DocStatus
from app.models.land_parcel import LandParcel
from modules.legal_intel import parse_document

documents_bp = Blueprint("documents", __name__, url_prefix="/api/documents")

ALLOWED_EXTENSIONS = {".txt", ".pdf", ".png", ".jpg", ".jpeg"}


def _get_db():
    return SessionLocal()


@documents_bp.post("/upload/<parcel_id>")
@jwt_required()
def upload_document(parcel_id):
    db = _get_db()
    try:
        parcel = db.get(LandParcel, parcel_id)
        if not parcel:
            return jsonify({"error": "Parcel not found"}), 404

        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        f = request.files["file"]
        if not f.filename:
            return jsonify({"error": "Empty filename"}), 400

        ext = os.path.splitext(f.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return jsonify({"error": f"Unsupported file type: {ext}"}), 400

        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        f.save(file_path)

        doc_type = request.form.get("doc_type", "other")
        ocr_result = parse_document(file_path, {})

        doc = Document(
            parcel_id=parcel_id,
            doc_type=doc_type,
            filename=f.filename,
            file_path=file_path,
            ocr_text=ocr_result.get("raw_text"),
            extracted_owner=ocr_result.get("owner_name"),
            extracted_area=ocr_result.get("area_sqft"),
            extracted_date=ocr_result.get("date"),
            integrity_score=ocr_result.get("integrity_score"),
            status=DocStatus.review,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        return jsonify({
            "id": doc.id,
            "parcel_id": doc.parcel_id,
            "doc_type": doc.doc_type.value,
            "filename": doc.filename,
            "status": doc.status.value,
            "ocr": ocr_result,
            "uploaded_at": doc.uploaded_at.isoformat(),
        }), 201
    finally:
        db.close()


@documents_bp.get("/parcel/<parcel_id>")
@jwt_required()
def list_documents(parcel_id):
    db = _get_db()
    try:
        docs = db.query(Document).filter_by(parcel_id=parcel_id).all()
        return jsonify([{
            "id": d.id,
            "doc_type": d.doc_type.value,
            "filename": d.filename,
            "status": d.status.value,
            "integrity_score": d.integrity_score,
            "extracted_owner": d.extracted_owner,
            "extracted_area": d.extracted_area,
            "uploaded_at": d.uploaded_at.isoformat(),
        } for d in docs])
    finally:
        db.close()


@documents_bp.patch("/<doc_id>/status")
@jwt_required()
def update_status(doc_id):
    db = _get_db()
    try:
        doc = db.get(Document, doc_id)
        if not doc:
            return jsonify({"error": "Document not found"}), 404
        status = (request.get_json() or {}).get("status")
        if status not in ("verified", "review", "missing"):
            return jsonify({"error": "Invalid status"}), 400
        doc.status = DocStatus(status)
        db.commit()
        return jsonify({"id": doc.id, "status": doc.status.value})
    finally:
        db.close()
