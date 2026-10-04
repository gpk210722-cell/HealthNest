from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.connection import Base


class Reel(Base):
    __tablename__ = "reels"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(
        String(200),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    video_url = Column(
        String(500),
        nullable=False,
    )

    thumbnail_url = Column(
        String(500),
        nullable=True,
    )

    category = Column(
        String(100),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # Relationship with User
    user = relationship(
        "User",
        back_populates="reels",
    )