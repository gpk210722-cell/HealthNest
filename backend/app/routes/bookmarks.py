from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.bookmark import Bookmark
from app.models.blog import Blog
from app.models.user import User


router = APIRouter(
    prefix="/api/bookmarks",
    tags=["Bookmarks"],
)


# --------------------------------
# SAVE / BOOKMARK BLOG
# --------------------------------
@router.post("/{blog_id}")
def save_blog(
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

    # Check existing bookmark
    existing_bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == user_id,
            Bookmark.blog_id == blog_id,
        )
        .first()
    )

    if existing_bookmark:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blog already saved",
        )

    new_bookmark = Bookmark(
        user_id=user_id,
        blog_id=blog_id,
    )

    db.add(new_bookmark)
    db.commit()
    db.refresh(new_bookmark)

    return {
        "message": "Blog saved successfully",
        "bookmark_id": new_bookmark.id,
        "blog_id": blog_id,
        "user_id": user_id,
    }


# --------------------------------
# REMOVE BOOKMARK
# --------------------------------
@router.delete("/{blog_id}")
def remove_bookmark(
    blog_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == user_id,
            Bookmark.blog_id == blog_id,
        )
        .first()
    )

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog is not saved",
        )

    db.delete(bookmark)
    db.commit()

    return {
        "message": "Blog removed from saved blogs",
        "blog_id": blog_id,
        "user_id": user_id,
    }


# --------------------------------
# CHECK BOOKMARK STATUS
# --------------------------------
@router.get("/{blog_id}/user/{user_id}")
def check_bookmark(
    blog_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == user_id,
            Bookmark.blog_id == blog_id,
        )
        .first()
    )

    return {
        "blog_id": blog_id,
        "user_id": user_id,
        "saved": bookmark is not None,
    }


# --------------------------------
# GET USER SAVED BLOGS
# --------------------------------
@router.get("/user/{user_id}")
def get_saved_blogs(
    user_id: int,
    db: Session = Depends(get_db),
):
    bookmarks = (
        db.query(Bookmark)
        .filter(Bookmark.user_id == user_id)
        .order_by(Bookmark.id.desc())
        .all()
    )

    return [
        {
            "bookmark_id": bookmark.id,
            "blog_id": bookmark.blog.id,
            "title": bookmark.blog.title,
            "category": bookmark.blog.category,
            "content": bookmark.blog.content,
            "user_id": bookmark.blog.user_id,
            "created_at": bookmark.blog.created_at,
        }
        for bookmark in bookmarks
    ]