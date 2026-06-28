from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ConversationHistoryItem(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    user_query: str = Field(min_length=1)
    session_id: str | None = None
    model_name: str | None = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_query": "Explain what a REST API is in two sentences.",
                "session_id": "user-123-abc",
                "model_name": "gpt-4o-mini",
            }
        }
    )
