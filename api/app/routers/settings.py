from fastapi import APIRouter

from app.config import get_api_access_key, settings
from app.logger import log_activity
from app.schema.responses import SettingsResponse

router = APIRouter()


@router.get("/", summary="Return safe, non-secret configuration", response_model=SettingsResponse)
@log_activity
async def get_settings():
    return SettingsResponse(
        project_name=settings.project_name,
        version=settings.version,
        default_model=settings.default_model,
        provider_base_url=settings.openai_base_url,
        auth_enabled=bool(get_api_access_key()),
    )
