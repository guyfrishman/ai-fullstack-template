from pydantic import BaseModel


class SessionResponse(BaseModel):
    session_id: str


class ChatResponse(BaseModel):
    answer: str
    trace_id: str
    session_id: str


class ModelInfo(BaseModel):
    name: str


class ModelsResponse(BaseModel):
    models: list[ModelInfo]
    default_model: str


class SettingsResponse(BaseModel):
    project_name: str
    version: str
    default_model: str
    provider_base_url: str
    auth_enabled: bool
