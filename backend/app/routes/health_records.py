from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.health_record import HealthRecord
from app.models.user import User


router = APIRouter(
    prefix="/api/health-records",
    tags=["Health Tracker"],
)


# ==========================================
# CREATE HEALTH RECORD
# ==========================================
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_health_record(
    user_id: int,
    water_intake: float = 0,
    sleep_hours: float = 0,
    exercise_minutes: int = 0,
    steps: int = 0,
    weight: float = 0,
    db: Session = Depends(get_db),
):
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

    record = HealthRecord(
        user_id=user_id,
        water_intake=water_intake,
        sleep_hours=sleep_hours,
        exercise_minutes=exercise_minutes,
        steps=steps,
        weight=weight,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "message": "Health record created successfully",
        "id": record.id,
        "user_id": record.user_id,
        "water_intake": record.water_intake,
        "sleep_hours": record.sleep_hours,
        "exercise_minutes": record.exercise_minutes,
        "steps": record.steps,
        "weight": record.weight,
        "created_at": record.created_at,
    }


# ==========================================
# GET USER HEALTH RECORDS
# ==========================================
@router.get("/user/{user_id}")
def get_user_health_records(
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
            status_code=404,
            detail="User not found",
        )

    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.created_at.desc())
        .all()
    )

    return [
        {
            "id": record.id,
            "user_id": record.user_id,
            "water_intake": record.water_intake,
            "sleep_hours": record.sleep_hours,
            "exercise_minutes": record.exercise_minutes,
            "steps": record.steps,
            "weight": record.weight,
            "created_at": record.created_at,
        }
        for record in records
    ]


# ==========================================
# GET SINGLE HEALTH RECORD
# ==========================================
@router.get("/{record_id}")
def get_health_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = (
        db.query(HealthRecord)
        .filter(HealthRecord.id == record_id)
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Health record not found",
        )

    return {
        "id": record.id,
        "user_id": record.user_id,
        "water_intake": record.water_intake,
        "sleep_hours": record.sleep_hours,
        "exercise_minutes": record.exercise_minutes,
        "steps": record.steps,
        "weight": record.weight,
        "created_at": record.created_at,
    }


# ==========================================
# DELETE HEALTH RECORD
# ==========================================
@router.delete("/{record_id}")
def delete_health_record(
    record_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    record = (
        db.query(HealthRecord)
        .filter(HealthRecord.id == record_id)
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Health record not found",
        )

    if record.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own health record",
        )

    db.delete(record)
    db.commit()

    return {
        "message": "Health record deleted successfully",
        "record_id": record_id,
    }