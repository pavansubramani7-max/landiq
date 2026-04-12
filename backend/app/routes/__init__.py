from app.routes.auth import auth_bp
from app.routes.parcels import parcels_bp
from app.routes.analysis import analysis_bp
from app.routes.documents import documents_bp
from app.routes.admin import admin_bp

__all__ = ["auth_bp", "parcels_bp", "analysis_bp", "documents_bp", "admin_bp"]
