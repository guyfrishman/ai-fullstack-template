# API — FastAPI service

A small, production-shaped FastAPI service with a provider-agnostic,
OpenAI-compatible LLM client.

## Architecture

```
app/
├── config.py                 # pydantic-settings, env-driven config
├── logger.py                 # @log_activity decorator + session/trace ContextVars
├── security.py               # verify_api_key X-API-Key dependency
├── routers/
│   ├── api.py                # composes the /api/v1 surface from feature routers
│   ├── ping.py               # GET /ping  (open)
│   ├── chat.py               # POST /chat/init, /chat/send_message
│   ├── models.py             # GET /models
│   └── settings.py           # GET /settings  (safe, non-secret config)
├── services/chat_service.py  # orchestration: history + model calls
├── repositories/
│   ├── llm_repository.py     # OpenAI-compatible client (OpenAI / Ollama / vLLM)
│   └── session_repository.py # SessionRepository interface + in-memory impl
├── schema/                   # pydantic request/response models
└── prompts/                  # system prompts
```

**Patterns worth noting**

- **Router composition** — each feature is a bare `APIRouter()`; `api.py`
  mounts them with `prefix`/`tags`. Handlers are short verb-noun functions.
- **Repository interface** — `SessionRepository` is abstract; the shipped
  `InMemorySessionRepository` can be swapped for a DB-backed one with no
  changes to the service layer.
- **Structured logging** — `@log_activity` emits STARTING / FINISHED / ERROR
  JSON lines tagged with request-scoped `session_id` / `trace_id`.
- **Auth** — `verify_api_key` guards `/api/v1/*`. If `API_ACCESS_KEY` is unset
  it is a **no-op (open)** — convenient for local dev.

## Configuration

Copy `.env.example` to `.env` and adjust:

| Variable          | Meaning                                              |
| ----------------- | ---------------------------------------------------- |
| `LOG_LEVEL`       | `INFO` / `DEBUG`                                     |
| `API_ACCESS_KEY`  | If set, `/api/v1/*` requires `X-API-Key`. Empty = open |
| `OPENAI_API_KEY`  | Provider key (not needed for local Ollama)           |
| `OPENAI_BASE_URL` | OpenAI-compatible endpoint                            |
| `DEFAULT_MODEL`   | Model used when none is requested                    |
| `UI_BASE_URL`     | Extra CORS origin to allow                            |

## Run locally (uv)

```bash
uv sync
uv run uvicorn main:app --reload
```

Then open http://localhost:8000/docs and hit `GET /ping`.

### Option A — OpenAI

```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
DEFAULT_MODEL=gpt-4o-mini
```

### Option B — fully offline with Ollama

```bash
ollama pull llama3.2
ollama serve
```

```env
OPENAI_BASE_URL=http://localhost:11434/v1
DEFAULT_MODEL=llama3.2
# OPENAI_API_KEY can stay empty for Ollama
```

The LLM client speaks the OpenAI protocol, so no code changes are needed to
switch providers — only `.env`.

## Test

```bash
uv run pytest
```

Tests mock the LLM client, so they run with no network and no API key.

## Docker

```bash
docker build -t ai-template-api .
docker run --rm -p 8000:8000 --env-file .env ai-template-api
```
