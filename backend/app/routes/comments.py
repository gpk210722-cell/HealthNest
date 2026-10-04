from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.comment import Comment
from app.models.blog import Blog
from app.models.user import User


router = APIRouter(
    prefix="/api/comments",
    tags=["Comments"],
)


# --------------------------------
# ADD COMMENT
# --------------------------------
@router.post("/{blog_id}")
def add_comment(
    blog_id: int,
    user_id: int,
    content: str,
    db: Session = Depends(get_db),
):
    # Check user
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Check blog
    blog = (
        db.query(Blog)
        .filter(Blog.id == blog_id)
        .first()
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    # Validate comment
    if not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment cannot be empty",
        )

    new_comment = Comment(
        content=content.strip(),
        user_id=user_id,
        blog_id=blog_id,
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {
        "message": "Comment added successfully",
        "id": new_comment.id,
        "content": new_comment.content,
        "user_id": new_comment.user_id,
        "blog_id": new_comment.blog_id,
        "created_at": new_comment.created_at,
    }


# --------------------------------
# GET COMMENTS
# --------------------------------
@router.get("/{blog_id}")
def get_comments(
    blog_id: int,
    db: Session = Depends(get_db),
):
    # Check blog
    blog = (
        db.query(Blog)
        .filter(Blog.id == blog_id)
        .first()
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    comments = (
        db.query(Comment)
        .filter(Comment.blog_id == blog_id)
        .order_by(Comment.created_at.desc())
        .all()
    )

    return [
        {
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "blog_id": comment.blog_id,
            "created_at": comment.created_at,
        }
        for comment in comments
    ]


# --------------------------------
# DELETE COMMENT
# --------------------------------
@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )

    # Only comment owner can delete
    if comment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own comment",
        )

    db.delete(comment)
    db.commit()

    return {
        "message": "Comment deleted successfully",
        "comment_id": comment_id,
    }