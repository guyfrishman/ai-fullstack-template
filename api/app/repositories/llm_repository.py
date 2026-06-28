from openai import OpenAI

from app.config import settings
from app.logger import log_activity, log_metric

# Chat messages are plain OpenAI-style dicts: {"role": ..., "content": ...}
Message = dict[str, str]


class LlmRepository:
    """Provider-agnostic chat client built on the OpenAI SDK.

    Point ``OPENAI_BASE_URL`` at any OpenAI-compatible endpoint:
      - OpenAI:        https://api.openai.com/v1   (needs OPENAI_API_KEY)
      - Local Ollama:  http://localhost:11434/v1   (no real key needed)
      - vLLM / LM Studio / others that speak the OpenAI protocol

    Nothing in this class is specific to a single vendor.
    """

    _client: OpenAI | None = None

    @classmethod
    def _get_client(cls) -> OpenAI:
        if cls._client is None:
            # Some local servers (e.g. Ollama) ignore the key but the SDK
            # still requires a non-empty string, so fall back to a placeholder.
            cls._client = OpenAI(
                base_url=settings.openai_base_url,
                api_key=settings.openai_api_key or "not-needed",
            )
        return cls._client

    @classmethod
    @log_activity
    def chat(cls, messages: list[Message], model_name: str | None = None) -> str:
        """Send a list of chat messages and return the assistant's reply text."""
        model = model_name or settings.default_model
        response = cls._get_client().chat.completions.create(
            model=model,
            messages=messages,
        )
        usage = response.usage
        log_metric(
            model=model,
            prompt_tokens=usage.prompt_tokens if usage else 0,
            completion_tokens=usage.completion_tokens if usage else 0,
            total_tokens=usage.total_tokens if usage else 0,
        )
        return response.choices[0].message.content or ""

    @classmethod
    @log_activity
    def list_available_models(cls) -> list[str]:
        """List model ids the configured provider serves."""
        return [model.id for model in cls._get_client().models.list().data]
