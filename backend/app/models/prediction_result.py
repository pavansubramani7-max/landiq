import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, Enum, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class RiskLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Recommendation(str, enum.Enum):
    buy = "buy"
    hold = "hold"
    avoid = "avoid"


class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id: Mapped[str] = mapped_column(String(36), ForeignKey("land_parcels.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    estimated_value: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_interval: Mapped[float] = mapped_column(Float, nullable=True)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0-100
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), nullable=False)
    fraud_probability: Mapped[float] = mapped_column(Float, nullable=False)  # 0-1
    investment_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0-100
    recommendation: Mapped[Recommendation] = mapped_column(Enum(Recommendation), nullable=False)
    shap_values: Mapped[dict] = mapped_column(JSON, nullable=True)
    forecast_1yr: Mapped[float] = mapped_column(Float, nullable=True)
    forecast_3yr: Mapped[float] = mapped_column(Float, nullable=True)
    model_version: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    parcel = relationship("LandParcel", back_populates="predictions")
    user = relationship("User", back_populates="predictions")
