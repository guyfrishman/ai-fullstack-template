# Routers

How the API structures its routes. The pattern is small and consistent — read
one router and you understand them all.

## `routers/api.py` — bare composition, prefix + tag here

```python
from fastapi import APIRouter
from app.routers import chat, models, settings as settings_router

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(models.router, prefix="/models", tags=["Models"])
api_router.include_router(settings_router.router, prefix="/settings", tags=["Settings"])
```

Rules:
- Prefix goes on the `include_router(...)` call, **not** on the sub-router's `APIRouter()`.
- Tag goes on `include_router(...)` too — a capitalized noun (`Chat`, `Models`).
- One `include_router` per resource group.

## `routers/<resource>.py` — bare APIRouter, short handlers, summary on every route

```python
from fastapi import APIRouter
from app.logger import log_activity
from app.schema.requests import ChatRequest
from app.schema.responses import ChatResponse, SessionResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/init", summary="Initialize a new chat session", response_model=SessionResponse)
@log_activity
async def init_session():
    return SessionResponse(session_id=ChatService.init_session())


@router.post("/send_message", summary="Send a message to the chat", response_model=ChatResponse)
@log_activity
async def send_message(request: ChatRequest):
    return ChatService.send_message(request)
```

Rules:
- `router = APIRouter()` — no prefix, no tag at the router level.
- Every route has `summary=` (shows in Swagger) and, where it returns a body,
  `response_model=`.
- Handler names are **short verb-noun**: `send_message`, `list_models`,
  `get_settings`. Not `send_a_chat_message_to_the_model`.
- `@log_activity` on every handler.
- Handlers are **thin** — delegate to a service immediately. No business logic,
  no model calls, no storage access in a router.

## Top-level mounting

`main.py` applies the version prefix and the auth dependency:

```python
app.include_router(ping_router)
app.include_router(api_router, prefix="/api/v1", dependencies=[Depends(verify_api_key)])
```

- `/ping` is unauthenticated and lives outside `/api/v1`.
- Everything else is `/api/v1/<resource>/<action>` and passes through
  `verify_api_key` (a no-op when no key is configured — see
  [configuration.md](configuration.md)).

## Path naming

- Lowercase, hyphenated for multi-word paths.
- Group by resource (`/chat`, `/models`, `/settings`); the action follows.

## Error handling

- Known errors (bad id, missing field): raise `HTTPException` with a clear
  `detail` in the handler or service.
- Unknown errors: let them bubble — `@log_activity` records them as `ERROR` and
  FastAPI returns 500.

## Why this exact pattern

See [`../decisions/0001-provider-agnostic-llm-client.md`](../decisions/0001-provider-agnostic-llm-client.md)
for related design rationale, and the FastAPI router pattern is intentionally
opinionated so every endpoint looks the same.
