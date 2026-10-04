from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.like import Like
from app.models.blog import Blog
from app.models.user import User


router = APIRouter(
    prefix="/api/likes",
    tags=["Likes"],
)


# --------------------------------
# LIKE BLOG
# --------------------------------
@router.post("/{blog_id}")
def like_blog(
    blog_id: int,
    user_id: int,
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

    # Check existing like
    existing_like = (
        db.query(Like)
        .filter(
            Like.user_id == user_id,
            Like.blog_id == blog_id,
        )
        .first()
    )

    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blog already liked",
        )

    new_like = Like(
        user_id=user_id,
        blog_id=blog_id,
    )

    db.add(new_like)
    db.commit()
    db.refresh(new_like)

    like_count = (
        db.query(Like)
        .filter(Like.blog_id == blog_id)
        .count()
    )

    return {
        "message": "Blog liked successfully",
        "blog_id": blog_id,
        "user_id": user_id,
        "like_count": like_count,
    }


# --------------------------------
# UNLIKE BLOG
# --------------------------------
@router.delete("/{blog_id}")
def unlike_blog(
    blog_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    existing_like = (
        db.query(Like)
        .filter(
            Like.user_id == user_id,
            Like.blog_id == blog_id,
        )
        .first()
    )

    if not existing_like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found",
        )

    db.delete(existing_like)
    db.commit()

    like_count = (
        db.query(Like)
        .filter(Like.blog_id == blog_id)
        .count()
    )

    return {
        "message": "Blog unliked successfully",
        "blog_id": blog_id,
        "user_id": user_id,
        "like_count": like_count,
    }


# --------------------------------
# GET LIKE COUNT
# --------------------------------
@router.get("/{blog_id}")
def get_like_count(
    blog_id: int,
    db: Session = Depends(get_db),
):
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

    like_count = (
        db.query(Like)
        .filter(Like.blog_id == blog_id)
        .count()
    )

    return {
        "blog_id": blog_id,
        "like_count": like_count,
    }


# --------------------------------
# CHECK USER LIKE STATUS
# --------------------------------
@router.get("/{blog_id}/user/{user_id}")
def check_user_like(
    blog_id: int,
    user_id: int,
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

    # Check like
    existing_like = (
        db.query(Like)
        .filter(
            Like.user_id == user_id,
            Like.blog_id == blog_id,
        )
        .first()
    )

    return {
        "blog_id": blog_id,
        "user_id": user_id,
        "liked": existing_like is not None,
    }