from fastapi import APIRouter

from app.routers import (
    chat,
    models,
    settings as settings_router,
)

# Composes the versioned API surface from bare per-feature routers.
# Mounted under /api/v1 in main.py.
api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(models.router, prefix="/models", tags=["Models"])
api_router.include_router(settings_router.router, prefix="/settings", tags=["Settings"])
