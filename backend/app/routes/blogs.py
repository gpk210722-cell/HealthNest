from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.connection import get_db
from app.models.blog import Blog
from app.models.user import User
from app.schemas.blog_schema import BlogCreate, BlogResponse


router = APIRouter(
    prefix="/api/blogs",
    tags=["Blogs"],
)


# ==========================================
# CREATE BLOG
# ==========================================
@router.post(
    "/",
    response_model=BlogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_blog(
    blog_data: BlogCreate,
    user_id: int,
    db: Session = Depends(get_db),
):
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

    new_blog = Blog(
        title=blog_data.title,
        category=blog_data.category,
        content=blog_data.content,
        user_id=user_id,
    )

    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)

    return new_blog


# ==========================================
# GET ALL BLOGS
# SEARCH + CATEGORY FILTER
# ==========================================
@router.get(
    "/",
    response_model=list[BlogResponse],
)
def get_blogs(
    search: str | None = Query(
        default=None,
        description="Search blogs by title, content or category",
    ),
    category: str | None = Query(
        default=None,
        description="Filter blogs by category",
    ),
    db: Session = Depends(get_db),
):
    query = db.query(Blog)

    # --------------------------------------
    # SEARCH BY TITLE, CONTENT OR CATEGORY
    # --------------------------------------
    if search and search.strip():

        search_text = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Blog.title.ilike(search_text),
                Blog.content.ilike(search_text),
                Blog.category.ilike(search_text),
            )
        )

    # --------------------------------------
    # FILTER BY CATEGORY
    # --------------------------------------
    if category and category.strip():

        query = query.filter(
            Blog.category.ilike(
                category.strip()
            )
        )

    # --------------------------------------
    # RETURN RESULTS
    # --------------------------------------
    return (
        query
        .order_by(Blog.created_at.desc())
        .all()
    )


# ==========================================
# GET USER BLOGS
# ==========================================
@router.get(
    "/user/{user_id}",
    response_model=list[BlogResponse],
)
def get_user_blogs(
    user_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Blog)
        .filter(Blog.user_id == user_id)
        .order_by(Blog.created_at.desc())
        .all()
    )


# ==========================================
# GET SINGLE BLOG
# ==========================================
@router.get(
    "/{blog_id}",
    response_model=BlogResponse,
)
def get_blog(
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

    return blog


# ==========================================
# UPDATE BLOG
# ==========================================
@router.put(
    "/{blog_id}",
    response_model=BlogResponse,
)
def update_blog(
    blog_id: int,
    blog_data: BlogCreate,
    user_id: int,
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

    if blog.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can edit only your own blog",
        )

    blog.title = blog_data.title
    blog.category = blog_data.category
    blog.content = blog_data.content

    db.commit()
    db.refresh(blog)

    return blog


# ==========================================
# DELETE BLOG
# ==========================================
@router.delete(
    "/{blog_id}",
    status_code=status.HTTP_200_OK,
)
def delete_blog(
    blog_id: int,
    user_id: int,
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

    if blog.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own blog",
        )

    db.delete(blog)
    db.commit()

    return {
        "message": "Blog deleted successfully",
        "blog_id": blog_id,
    }