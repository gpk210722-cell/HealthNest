from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.connection import Base, engine


# =========================
# DATABASE MODELS
# =========================

from app.models.user import User
from app.models.blog import Blog
from app.models.like import Like
from app.models.comment import Comment
from app.models.bookmark import Bookmark
from app.models.health_record import HealthRecord
from app.models.reel import Reel


# =========================
# ROUTES
# =========================

from app.routes.auth import router as auth_router
from app.routes.blogs import router as blogs_router
from app.routes.likes import router as likes_router
from app.routes.comments import router as comments_router
from app.routes.bookmarks import router as bookmarks_router
from app.routes.users import router as users_router
from app.routes.health_records import router as health_records_router
from app.routes.recommendations import router as recommendations_router
from app.routes.admin import router as admin_router
from app.routes.stats import router as stats_router
from app.routes.reels import router as reels_router


# =========================
# CREATE DATABASE TABLES
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# FASTAPI APP
# =========================

app = FastAPI(
    title="HealthNest API",
    description="Backend API for HealthNest health and wellness platform",
    version="1.0.0",
)


# =========================
# STATIC FILES
# =========================

# Uploaded reel videos will be accessible through /uploads/...
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# INCLUDE ROUTES
# =========================

app.include_router(auth_router)
app.include_router(blogs_router)
app.include_router(likes_router)
app.include_router(comments_router)
app.include_router(bookmarks_router)
app.include_router(users_router)
app.include_router(health_records_router)
app.include_router(recommendations_router)
app.include_router(admin_router)
app.include_router(stats_router)
app.include_router(reels_router)


# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "Welcome to HealthNest API",
        "status": "Backend is running",
    }


# =========================
# HEALTH CHECK
# =========================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }