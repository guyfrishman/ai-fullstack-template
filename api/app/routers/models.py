from fastapi import APIRouter

from app.logger import log_activity
from app.schema.responses import ModelsResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.get("/", summary="List available chat models", response_model=ModelsResponse)
@log_activity
async def list_models():
    return ChatService.list_models()
