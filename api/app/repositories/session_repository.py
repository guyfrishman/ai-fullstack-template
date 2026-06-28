import uuid
from abc import ABC, abstractmethod

# A chat message is a plain OpenAI-style dict: {"role": ..., "content": ...}
Message = dict[str, str]


class SessionRepository(ABC):
    """Storage interface for chat sessions and their message history.

    The application depends only on this interface, so the in-memory
    implementation below can be swapped for a database-backed one
    (Redis, Postgres, DynamoDB, ...) without touching the service layer.
    """

    @abstractmethod
    def create_session(self) -> str:
        """Create a new empty session and return its id."""

    @abstractmethod
    def exists(self, session_id: str) -> bool:
        """Return True if the session id is known."""

    @abstractmethod
    def get_history(self, session_id: str) -> list[Message]:
        """Return the ordered message history for a session (empty if unknown)."""

    @abstractmethod
    def append_message(self, session_id: str, role: str, content: str) -> None:
        """Append a message to a session's history, creating it if needed."""


class InMemorySessionRepository(SessionRepository):
    """Process-local, dict-backed session store.

    History is lost when the process restarts — fine for local development
    and demos. A DB-backed implementation of ``SessionRepository`` can drop
    in for production with no changes to callers.
    """

    def __init__(self) -> None:
        self._sessions: dict[str, list[Message]] = {}

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = []
        return session_id

    def exists(self, session_id: str) -> bool:
        return session_id in self._sessions

    def get_history(self, session_id: str) -> list[Message]:
        return list(self._sessions.get(session_id, []))

    def append_message(self, session_id: str, role: str, content: str) -> None:
        self._sessions.setdefault(session_id, []).append(
            {"role": role, "content": content}
        )


# Single shared instance used by the service layer. Swap this construction
# (e.g. for a RedisSessionRepository) to change the backing store app-wide.
session_repository: SessionRepository = InMemorySessionRepository()
