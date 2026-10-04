from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

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
        backref="bookmarks",
    )

    blog = relationship(
        "Blog",
        backref="bookmarks",
    )

    # Same user cannot save the same blog twice
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "blog_id",
            name="unique_user_blog_bookmark",
        ),
    )