from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Like(Base):
    __tablename__ = "likes"

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

    blog_id = Column(
        Integer,
        ForeignKey("blogs.id"),
        nullable=False,
    )

    user = relationship(
        "User",
        backref="likes",
    )

    blog = relationship(
        "Blog",
        backref="likes",
    )

    # Same user cannot like the same blog twice
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "blog_id",
            name="unique_user_blog_like",
        ),
    )