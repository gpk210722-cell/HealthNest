from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.blog import Blog
from app.models.like import Like
from app.models.comment import Comment

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):

    total_users = db.query(User).count()
    total_blogs = db.query(Blog).count()
    total_likes = db.query(Like).count()
    total_comments = db.query(Comment).count()

    recent_blogs = (
        db.query(Blog)
        .order_by(Blog.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "statistics": {
            "total_users": total_users,
            "total_blogs": total_blogs,
            "total_likes": total_likes,
            "total_comments": total_comments,
        },
        "recent_blogs": [
            {
                "id": blog.id,
                "title": blog.title,
                "category": blog.category,
                "user_id": blog.user_id,
                "created_at": blog.created_at,
            }
            for blog in recent_blogs
        ],
    }