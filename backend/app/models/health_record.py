from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database.connection import Base


class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    water_intake = Column(
        Float,
        default=0,
        nullable=False
    )

    sleep_hours = Column(
        Float,
        default=0,
        nullable=False
    )

    exercise_minutes = Column(
        Integer,
        default=0,
        nullable=False
    )

    steps = Column(
        Integer,
        default=0,
        nullable=False
    )

    weight = Column(
        Float,
        default=0,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship(
        "User",
        backref="health_records"
    )