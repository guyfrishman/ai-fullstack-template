# Pattern — Redis-backed SessionRepository

🧭 **Example** — not shipped. Shows how to replace in-memory session storage with
Redis so history survives restarts and is shared across API replicas.

## Why

`InMemorySessionRepository` is per-process: history is lost on restart and not
shared between replicas. The moment you run more than one API pod (see
[`../infrastructure/deployment.md`](../infrastructure/deployment.md)), you need a
shared store. Redis is the simplest good answer.

## The change is one interface implementation

Because the service layer depends only on `SessionRepository`
([`../conventions/repositories.md`](../conventions/repositories.md)), nothing in
`ChatService` or the routers changes.

```python
# app/repositories/redis_session_repository.py  (example)
import json
import uuid

import redis

from app.config import settings
from app.repositories.session_repository import Message, SessionRepository


class RedisSessionRepository(SessionRepository):
    """SessionRepository backed by Redis. History is stored as a JSON list per
    session key, with a TTL so abandoned sessions expire on their own."""

    def __init__(self, url: str, ttl_seconds: int = 60 * 60 * 24) -> None:
        self._r = redis.Redis.from_url(url, decode_responses=True)
        self._ttl = ttl_seconds

    @staticmethod
    def _key(session_id: str) -> str:
        return f"session:{session_id}"

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self._r.set(self._key(session_id), json.dumps([]), ex=self._ttl)
        return session_id

    def exists(self, session_id: str) -> bool:
        return bool(self._r.exists(self._key(session_id)))

    def get_history(self, session_id: str) -> list[Message]:
        raw = self._r.get(self._key(session_id))
        return json.loads(raw) if raw else []

    def append_message(self, session_id: str, role: str, content: str) -> None:
        history = self.get_history(session_id)
        history.append({"role": role, "content": content})
        self._r.set(self._key(session_id), json.dumps(history), ex=self._ttl)
```

## Wiring it in

Swap the single construction line in `session_repository.py`:

```python
# before
session_repository: SessionRepository = InMemorySessionRepository()

# after
session_repository: SessionRepository = RedisSessionRepository(settings.redis_url)
```

Add `redis_url` to `Settings` and `REDIS_URL` to `.env.example`, and `redis` to
the API dependencies. No service or router edits.

## Notes

- `decode_responses=True` keeps values as `str`, matching the in-memory shape.
- A TTL gives free cleanup of dead sessions.
- For very long conversations, store messages in a Redis list (`RPUSH`/`LRANGE`)
  and trim to the last N turns instead of rewriting the whole JSON blob.
- This is also the point at which you'd add a context-window trimming policy
  before replaying history to the model.
