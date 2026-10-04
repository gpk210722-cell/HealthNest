from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.health_record import HealthRecord

router = APIRouter(
    prefix="/api/recommendations",
    tags=["AI Recommendations"],
)


@router.get("/user/{user_id}")
def get_recommendations(
    user_id: int,
    db: Session = Depends(get_db)
):
    record = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.created_at.desc())
        .first()
    )

    if not record:
        return {
            "user_id": user_id,
            "message": "No health data available",
            "recommendations": [
                "Add your health record to get personalized recommendations."
            ],
        }

    recommendations = []

    # Water recommendation
    if record.water_intake < 2:
        recommendations.append(
            "💧 Your water intake is low. Try to drink more water throughout the day."
        )
    else:
        recommendations.append(
            "💧 Your water intake looks good. Keep yourself hydrated."
        )

    # Sleep recommendation
    if record.sleep_hours < 7:
        recommendations.append(
            "😴 Your sleep duration is low. Try maintaining a regular sleep schedule and aim for adequate rest."
        )
    elif record.sleep_hours > 9:
        recommendations.append(
            "😴 You are sleeping for a long duration. Maintain a consistent sleep routine."
        )
    else:
        recommendations.append(
            "😴 Your sleep duration is within a healthy range. Keep your sleep schedule consistent."
        )

    # Exercise recommendation
    if record.exercise_minutes < 30:
        recommendations.append(
            "🏃 Your exercise time is low. Try adding 20–30 minutes of physical activity to your daily routine."
        )
    else:
        recommendations.append(
            "🏃 Good job staying physically active. Keep exercising regularly."
        )

    # Steps recommendation
    if record.steps < 5000:
        recommendations.append(
            "👣 Your step count is low. Try taking short walks between study sessions."
        )
    else:
        recommendations.append(
            "👣 Your activity level looks good. Keep moving throughout the day."
        )

    # Weight recommendation
    if record.weight > 0:
        recommendations.append(
            f"⚖️ Your latest recorded weight is {record.weight} kg. Focus on balanced nutrition and regular physical activity."
        )

    return {
        "user_id": user_id,
        "based_on": {
            "water_intake": record.water_intake,
            "sleep_hours": record.sleep_hours,
            "exercise_minutes": record.exercise_minutes,
            "steps": record.steps,
            "weight": record.weight,
        },
        "recommendations": recommendations,
    }