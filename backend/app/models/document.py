import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class DocType(str, enum.Enum):
    sale_deed = "sale_deed"
    ec = "ec"
    khata = "khata"
    rtc = "rtc"
    other = "other"


class DocStatus(str, enum.Enum):
    verified = "verified"
    review = "review"
    missing = "missing"


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id: Mapped[str] = mapped_column(String(36), ForeignKey("land_parcels.id"), nullable=False)
    doc_type: Mapped[DocType] = mapped_column(Enum(DocType), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    ocr_text: Mapped[str] = mapped_column(Text, nullable=True)
    extracted_owner: Mapped[str] = mapped_column(String(255), nullable=True)
    extracted_area: Mapped[float] = mapped_column(Float, nullable=True)
    extracted_date: Mapped[str] = mapped_column(String(50), nullable=True)
    integrity_score: Mapped[float] = mapped_column(Float, nullable=True)  # 0-100
    status: Mapped[DocStatus] = mapped_column(Enum(DocStatus), default=DocStatus.review)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    parcel = relationship("LandParcel", back_populates="documents")
