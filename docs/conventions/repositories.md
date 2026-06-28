# Repositories

External I/O — storage and the model provider — sits behind a repository. This
is the seam that keeps the rest of the code testable and swappable.

## The two repositories

| Repository | Interface | Shipped implementation |
|---|---|---|
| `SessionRepository` | abstract base (`abc.ABC`) | `InMemorySessionRepository` |
| `LlmRepository` | concrete, provider-agnostic | OpenAI-compatible client |

### `SessionRepository` — storage behind an interface

`app/repositories/session_repository.py` defines an abstract interface and an
in-memory implementation:

```python
class SessionRepository(ABC):
    @abstractmethod
    def create_session(self) -> str: ...
    @abstractmethod
    def exists(self, session_id: str) -> bool: ...
    @abstractmethod
    def get_history(self, session_id: str) -> list[Message]: ...
    @abstractmethod
    def append_message(self, session_id: str, role: str, content: str) -> None: ...
```

A single module-level instance is what the service layer imports:

```python
session_repository: SessionRepository = InMemorySessionRepository()
```

**To swap the backing store** (Redis, Postgres, DynamoDB), write a new class that
implements `SessionRepository` and change that one construction line. No service
or router changes. That's the whole point of the interface.

### `LlmRepository` — the model client

`app/repositories/llm_repository.py` wraps the OpenAI SDK pointed at any
OpenAI-compatible endpoint. The provider is configuration, not code — see
[llm-usage.md](llm-usage.md).

## Rules

- **Repositories own I/O; nothing else does.** Services and routers never call
  `OpenAI(...)` or touch a datastore directly.
- **Return plain data**, not transport types. A repository returns dicts / domain
  values, not `Response` objects.
- **Keep the interface minimal.** Add a method when a caller needs it, not
  speculatively.
- **`@log_activity` on repository methods** so I/O shows up in traces.

## Why server-side history

Conversation history lives in the `SessionRepository`, not in the browser. The
client sends only the latest turn plus a `session_id`. See
[`../decisions/0002-server-side-session-history.md`](../decisions/0002-server-side-session-history.md).
