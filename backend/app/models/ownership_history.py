import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class OwnershipHistory(Base):
    __tablename__ = "ownership_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id: Mapped[str] = mapped_column(String(36), ForeignKey("land_parcels.id"), nullable=False)
    owner_name: Mapped[str] = mapped_column(String(255), nullable=False)
    transfer_date: Mapped[datetime] = mapped_column(Date, nullable=True)
    transfer_price: Mapped[float] = mapped_column(Float, nullable=True)
    document_ref: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    parcel = relationship("LandParcel", back_populates="ownership_history")
