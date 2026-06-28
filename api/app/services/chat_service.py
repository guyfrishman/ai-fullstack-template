from app.config import settings
from app.logger import log_activity, log_metric, session_id_var, trace_id_var
from app.prompts.system_prompts import chat_system_prompt
from app.repositories.llm_repository import LlmRepository
from app.repositories.session_repository import session_repository
from app.schema.requests import ChatRequest
from app.schema.responses import ChatResponse, ModelInfo, ModelsResponse


class ChatService:
    """Orchestrates chat sessions: history (via the session repository) and
    model calls (via the LLM repository). Holds no transport concerns."""

    @staticmethod
    @log_activity
    def init_session() -> str:
        """Create a new chat session and return its id."""
        return session_repository.create_session()

    @staticmethod
    @log_activity
    def list_models() -> ModelsResponse:
        """List models the provider serves. On any provider error, degrade to
        the default model rather than failing the request."""
        try:
            names = LlmRepository.list_available_models()
        except Exception as e:
            log_metric(outcome="model_list_unavailable", error=str(e))
            names = []

        if settings.default_model not in names:
            names.insert(0, settings.default_model)

        return ModelsResponse(
            models=[ModelInfo(name=name) for name in names],
            default_model=settings.default_model,
        )

    @staticmethod
    @log_activity
    def send_message(request: ChatRequest) -> ChatResponse:
        """Append the user message to session history, call the model with the
        full history, persist the reply, and return it."""
        session_id = request.session_id
        if not session_id or not session_repository.exists(session_id):
            session_id = session_repository.create_session()
        session_id_var.set(session_id)

        session_repository.append_message(session_id, "user", request.user_query)

        messages = [{"role": "system", "content": chat_system_prompt}]
        messages += session_repository.get_history(session_id)

        answer = LlmRepository.chat(messages, model_name=request.model_name)
        session_repository.append_message(session_id, "assistant", answer)

        return ChatResponse(
            answer=answer,
            trace_id=trace_id_var.get(),
            session_id=session_id,
        )
