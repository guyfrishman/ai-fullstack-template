from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.api import api_router
from app.routers.ping import router as ping_router
from app.security import verify_api_key

app = FastAPI(title=settings.project_name, version=settings.version)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
if settings.ui_base_url and settings.ui_base_url not in allowed_origins:
    allowed_origins.append(settings.ui_base_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# /ping is open (liveness). Everything under /api/v1 sits behind the API key.
app.include_router(ping_router)
app.include_router(api_router, prefix="/api/v1", dependencies=[Depends(verify_api_key)])
