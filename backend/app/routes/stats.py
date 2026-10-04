from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.models.user import User
from app.models.blog import Blog
from app.models.like import Like
from app.models.comment import Comment

router = APIRouter(
    prefix="/api/stats",
    tags=["Statistics"],
)


@router.get("/")
def get_stats(db: Session = Depends(get_db)):

    total_articles = db.query(Blog).count()

    total_readers = db.query(User).count()

    total_topics = (
        db.query(func.count(func.distinct(Blog.category)))
        .scalar()
    )

    total_likes = db.query(Like).count()

    total_comments = db.query(Comment).count()

    total_interactions = total_likes + total_comments

    return {
        "health_articles": total_articles,
        "readers": total_readers,
        "health_topics": total_topics,
        "community_interactions": total_interactions,
    }