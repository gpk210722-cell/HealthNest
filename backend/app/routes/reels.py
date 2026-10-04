import os
import shutil
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.reel import Reel
from app.models.user import User


router = APIRouter(
    prefix="/api/reels",
    tags=["Reels"],
)


UPLOAD_DIR = "uploads/reels"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


# =========================================================
# CREATE / UPLOAD REEL
# =========================================================

@router.post("/")
async def create_reel(
    user_id: int = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("General"),
    video: UploadFile = File(...),
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

    # Allowed video formats
    allowed_extensions = {
        ".mp4",
        ".mov",
        ".avi",
        ".mkv",
        ".webm",
    }

    original_name = video.filename or ""

    extension = os.path.splitext(
        original_name
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid video format. "
                "Allowed formats: MP4, MOV, AVI, MKV, WEBM"
            ),
        )

    # Create unique filename
    filename = (
        f"{uuid4().hex}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        filename,
    )

    # Save video
    try:

        with open(
            file_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                video.file,
                buffer,
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to save video: {str(e)}"
            ),
        )

    video_url = (
        f"/uploads/reels/{filename}"
    )

    # Create database record
    reel = Reel(
        user_id=user_id,
        title=title,
        description=description,
        category=category,
        video_url=video_url,
    )

    db.add(reel)

    db.commit()

    db.refresh(reel)

    return {
        "message": "Reel uploaded successfully",

        "reel": {
            "id": reel.id,

            "user_id": reel.user_id,

            # ACTUAL PROFILE NAME
            "user_name": user.name,

            "title": reel.title,

            "description": reel.description,

            "category": reel.category,

            "video_url": reel.video_url,

            "thumbnail_url": reel.thumbnail_url,

            "created_at": reel.created_at,
        },
    }


# =========================================================
# GET ALL REELS
# =========================================================

@router.get("/")
def get_reels(
    db: Session = Depends(get_db),
):

    reels = (
        db.query(Reel)
        .order_by(
            Reel.created_at.desc()
        )
        .all()
    )

    result = []

    for reel in reels:

        # Find the user who uploaded this reel
        user = (
            db.query(User)
            .filter(
                User.id == reel.user_id
            )
            .first()
        )

        # Get actual profile name
        if user:
            user_name = user.name
        else:
            user_name = "HealthNest User"

        result.append({

            "id": reel.id,

            "user_id": reel.user_id,

            # THIS IS THE IMPORTANT PART
            "user_name": user_name,

            "title": reel.title,

            "description": reel.description,

            "category": reel.category,

            "video_url": reel.video_url,

            "thumbnail_url": reel.thumbnail_url,

            "created_at": reel.created_at,

        })

    return {

        "count": len(result),

        "reels": result,

    }


# =========================================================
# GET SINGLE REEL
# =========================================================

@router.get("/{reel_id}")
def get_reel(
    reel_id: int,
    db: Session = Depends(get_db),
):

    reel = (
        db.query(Reel)
        .filter(
            Reel.id == reel_id
        )
        .first()
    )

    if not reel:

        raise HTTPException(
            status_code=404,
            detail="Reel not found",
        )

    # Find uploader
    user = (
        db.query(User)
        .filter(
            User.id == reel.user_id
        )
        .first()
    )

    if user:
        user_name = user.name
    else:
        user_name = "HealthNest User"

    return {

        "id": reel.id,

        "user_id": reel.user_id,

        "user_name": user_name,

        "title": reel.title,

        "description": reel.description,

        "category": reel.category,

        "video_url": reel.video_url,

        "thumbnail_url": reel.thumbnail_url,

        "created_at": reel.created_at,

    }


# =========================================================
# DELETE REEL
# =========================================================

@router.delete("/{reel_id}")
def delete_reel(
    reel_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):

    reel = (
        db.query(Reel)
        .filter(
            Reel.id == reel_id
        )
        .first()
    )

    if not reel:

        raise HTTPException(
            status_code=404,
            detail="Reel not found",
        )

    # Only owner can delete
    if reel.user_id != user_id:

        raise HTTPException(
            status_code=403,
            detail=(
                "You can only delete your own reel"
            ),
        )

    # Delete video file
    if reel.video_url:

        file_path = (
            reel.video_url.lstrip("/")
        )

        if os.path.exists(file_path):

            os.remove(file_path)

    # Delete database record
    db.delete(reel)

    db.commit()

    return {
        "message":
            "Reel deleted successfully"
    }