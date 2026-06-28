from fastapi import APIRouter

from app.logger import log_activity
from app.schema.requests import ChatRequest
from app.schema.responses import ChatResponse, SessionResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/init", summary="Initialize a new chat session", response_model=SessionResponse)
@log_activity
async def init_session():
    return SessionResponse(session_id=ChatService.init_session())


@router.post("/send_message", summary="Send a message to the chat", response_model=ChatResponse)
@log_activity
async def send_message(request: ChatRequest):
    return ChatService.send_message(request)
