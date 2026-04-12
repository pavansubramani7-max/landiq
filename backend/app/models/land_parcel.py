import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Float, Boolean, DateTime, Enum, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class LandType(str, enum.Enum):
    residential = "residential"
    agricultural = "agricultural"
    commercial = "commercial"
    industrial = "industrial"


class FloodZoneRisk(str, enum.Enum):
    low = "low"
    moderate = "moderate"
    high = "high"


class PendingLitigations(str, enum.Enum):
    none = "none"
    one = "one"
    multiple = "multiple"
    court_review = "court_review"


class LandParcel(Base):
    __tablename__ = "land_parcels"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    survey_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)
    land_type: Mapped[LandType] = mapped_column(Enum(LandType), nullable=False)
    area_sqft: Mapped[float] = mapped_column(Float, nullable=False)
    quoted_price: Mapped[float] = mapped_column(Float, nullable=False)
    owner_name: Mapped[str] = mapped_column(String(255), nullable=False)
    num_ownership_changes: Mapped[int] = mapped_column(Integer, default=0)
    last_transfer_year: Mapped[int] = mapped_column(Integer, nullable=True)
    dist_highway_km: Mapped[float] = mapped_column(Float, nullable=True)
    dist_metro_km: Mapped[float] = mapped_column(Float, nullable=True)
    near_tech_park: Mapped[bool] = mapped_column(Boolean, default=False)
    flood_zone_risk: Mapped[FloodZoneRisk] = mapped_column(Enum(FloodZoneRisk), default=FloodZoneRisk.low)
    pending_litigations: Mapped[PendingLitigations] = mapped_column(Enum(PendingLitigations), default=PendingLitigations.none)
    created_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    creator = relationship("User", back_populates="parcels")
    predictions = relationship("PredictionResult", back_populates="parcel", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="parcel", cascade="all, delete-orphan")
    ownership_history = relationship("OwnershipHistory", back_populates="parcel", cascade="all, delete-orphan")
