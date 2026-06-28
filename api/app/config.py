import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    """Application configuration, loaded from environment / .env.

    Only neutral, non-cloud-coupled settings live here. Secrets are read
    but never returned by the public ``/settings`` endpoint.
    """

    # Logging
    log_level: str = "INFO"

    # Auth — when empty, API key auth is a no-op (open, for local dev)
    api_access_key: str = ""

    # LLM provider (OpenAI-compatible: OpenAI, Ollama, vLLM, LM Studio, ...)
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    default_model: str = "gpt-4o-mini"

    # UI origin allowed through CORS
    ui_base_url: str = "http://localhost:5173"

    # Service metadata
    project_name: str = "AI Fullstack Template API"
    version: str = "0.1.0"

    model_config = SettingsConfigDict(extra="ignore")


settings = Settings()


def get_api_access_key() -> str:
    """Read the API access key at call time so tests / runtime can toggle it.

    Returns an empty string when unset, which the security layer treats as
    "auth disabled" (open access) for local development.
    """
    return os.getenv("API_ACCESS_KEY", settings.api_access_key) or ""
