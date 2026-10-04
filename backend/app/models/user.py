from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password = Column(
        String(255),
        nullable=False,
    )

    # Profile picture
    profile_picture = Column(
        String(500),
        nullable=True,
    )

    blogs = relationship(
        "Blog",
        back_populates="author",
        cascade="all, delete-orphan",
    )

    reels = relationship(
        "Reel",
        back_populates="user",
        cascade="all, delete-orphan",
    )