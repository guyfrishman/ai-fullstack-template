import pytest
from fastapi.testclient import TestClient

from app.logger import logger as app_logger
from app.repositories.llm_repository import LlmRepository
from main import app

app_logger.disabled = True


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_llm(monkeypatch):
    """Replace the LLM client so tests never hit the network."""

    def fake_chat(messages, model_name=None):
        return "This is a mocked assistant reply."

    def fake_list_models():
        return ["mock-model-a", "mock-model-b"]

    monkeypatch.setattr(LlmRepository, "chat", classmethod(lambda cls, messages, model_name=None: fake_chat(messages, model_name)))
    monkeypatch.setattr(LlmRepository, "list_available_models", classmethod(lambda cls: fake_list_models()))
