# Pattern — Postgres-backed SessionRepository

🧭 **Example** — not shipped. Shows a durable, queryable session store when you
need history to persist long-term and be analyzable (audit, analytics, eval).

## When to choose this over Redis

| Need | Redis | Postgres |
|---|---|---|
| Survive restarts | ✅ | ✅ |
| Shared across replicas | ✅ | ✅ |
| Long-term durability | with persistence config | ✅ native |
| Query / join history (analytics, eval sets) | ✗ | ✅ |
| Lowest latency for hot sessions | ✅ | good |

A common production setup uses **both**: Postgres as the durable record, Redis as
a cache. Start with one; the interface lets you change your mind.

## Schema

```sql
CREATE TABLE chat_session (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_message (
    id          BIGSERIAL PRIMARY KEY,
    session_id  UUID NOT NULL REFERENCES chat_session(id) ON DELETE CASCADE,
    role        TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_message_session ON chat_message (session_id, id);
```

## Implementation

```python
# app/repositories/postgres_session_repository.py  (example)
import uuid

from sqlalchemy import create_engine, text

from app.repositories.session_repository import Message, SessionRepository


class PostgresSessionRepository(SessionRepository):
    """Durable SessionRepository on Postgres. One row per message, ordered by id."""

    def __init__(self, dsn: str) -> None:
        self._engine = create_engine(dsn, pool_pre_ping=True)

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        with self._engine.begin() as conn:
            conn.execute(
                text("INSERT INTO chat_session (id) VALUES (:id)"),
                {"id": session_id},
            )
        return session_id

    def exists(self, session_id: str) -> bool:
        with self._engine.connect() as conn:
            row = conn.execute(
                text("SELECT 1 FROM chat_session WHERE id = :id"),
                {"id": session_id},
            ).first()
        return row is not None

    def get_history(self, session_id: str) -> list[Message]:
        with self._engine.connect() as conn:
            rows = conn.execute(
                text(
                    "SELECT role, content FROM chat_message "
                    "WHERE session_id = :id ORDER BY id"
                ),
                {"id": session_id},
            ).all()
        return [{"role": r.role, "content": r.content} for r in rows]

    def append_message(self, session_id: str, role: str, content: str) -> None:
        with self._engine.begin() as conn:
            conn.execute(
                text(
                    "INSERT INTO chat_message (session_id, role, content) "
                    "VALUES (:sid, :role, :content)"
                ),
                {"sid": session_id, "role": role, "content": content},
            )
```

## Wiring it in

```python
session_repository: SessionRepository = PostgresSessionRepository(settings.database_url)
```

Add `database_url` to `Settings`, `DATABASE_URL` to `.env.example`, and
`sqlalchemy` + `psycopg` to dependencies. Migrations (Alembic) manage the schema.
As always — no service or router changes.

## Notes

- `ORDER BY id` preserves insertion order without relying on timestamps.
- `ON DELETE CASCADE` means deleting a session cleans up its messages.
- This store unlocks things Redis can't: building eval datasets from real
  conversations, per-user history, analytics — all plain SQL away.
