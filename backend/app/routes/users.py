import os
import shutil
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.blog import Blog
from app.models.bookmark import Bookmark
from app.models.like import Like


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


# =========================================================
# PROFILE PICTURE UPLOAD FOLDER
# =========================================================

UPLOAD_DIR = "uploads/profile_pictures"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


# =========================================================
# GET USER PROFILE
# =========================================================

@router.get("/{user_id}")
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
):

    # Find user
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


    # Count user's blogs
    blog_count = (
        db.query(Blog)
        .filter(
            Blog.user_id == user_id
        )
        .count()
    )


    # Count saved blogs
    saved_count = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == user_id
        )
        .count()
    )


    # Count likes given by user
    likes_count = (
        db.query(Like)
        .filter(
            Like.user_id == user_id
        )
        .count()
    )


    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "status": "Active",

        "profile_picture":
            user.profile_picture,

        "blog_count":
            blog_count,

        "saved_count":
            saved_count,

        "likes_count":
            likes_count,

    }


# =========================================================
# UPLOAD / CHANGE PROFILE PICTURE
# =========================================================

@router.post("/{user_id}/profile-picture")
async def upload_profile_picture(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    # Find user
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    # Allowed image formats
    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }


    original_name = (
        file.filename or ""
    )


    extension = os.path.splitext(
        original_name
    )[1].lower()


    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid image format. "
                "Allowed formats: JPG, JPEG, PNG, WEBP"
            ),
        )


    # Delete old profile picture
    if user.profile_picture:

        old_file_path = (
            user.profile_picture
            .lstrip("/")
        )

        if os.path.exists(
            old_file_path
        ):

            try:
                os.remove(
                    old_file_path
                )
            except Exception:
                pass


    # Create unique filename
    filename = (
        f"{uuid4().hex}{extension}"
    )


    file_path = os.path.join(
        UPLOAD_DIR,
        filename,
    )


    # Save image
    try:

        with open(
            file_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to save profile picture: {str(e)}"
            ),
        )


    # URL saved in database
    profile_picture_url = (
        f"/uploads/profile_pictures/{filename}"
    )


    # Update user
    user.profile_picture = (
        profile_picture_url
    )


    db.commit()

    db.refresh(user)


    return {

        "message":
            "Profile picture updated successfully",

        "profile_picture":
            user.profile_picture,

    }