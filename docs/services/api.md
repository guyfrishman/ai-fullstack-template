# api — FastAPI service

**Path:** `api/` · **Package:** `app` · **Port:** 8000

## What it does

A small chat API with a provider-agnostic LLM client. Creates chat sessions,
stores their history, and answers messages via an OpenAI-compatible model.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/ping` | open | Liveness check (`{"status": "ok"}`) |
| POST | `/api/v1/chat/init` | key if set | Create a chat session |
| POST | `/api/v1/chat/send_message` | key if set | Send a message, get a reply |
| GET | `/api/v1/models` | key if set | List available models (degrades to default) |
| GET | `/api/v1/settings` | key if set | Safe, non-secret config |

## Layout

```
app/
├── config.py          # typed Settings (configuration.md)
├── logger.py          # @log_activity + ContextVars (logging.md)
├── security.py        # verify_api_key dependency
├── routers/           # thin handlers, composed in api.py (routers.md)
├── services/          # ChatService — orchestration
├── repositories/      # SessionRepository + LlmRepository (repositories.md)
├── schema/            # pydantic request/response models
└── prompts/           # system prompts
main.py                # app, CORS, /ping open, /api/v1 behind verify_api_key
```

## Run

```bash
cd api
cp .env.example .env
uv sync
uv run uvicorn main:app --reload      # http://localhost:8000/docs
uv run pytest                         # tests (mock the LLM)
```

Provider config (OpenAI vs offline Ollama) is in
[`../conventions/llm-usage.md`](../conventions/llm-usage.md).

## Quirks

- **Auth is open by default** (no `API_ACCESS_KEY`). See
  [`../decisions/0003-optional-api-key-auth.md`](../decisions/0003-optional-api-key-auth.md).
- **Session history is in-memory** and resets on restart. See
  [`../decisions/0002-server-side-session-history.md`](../decisions/0002-server-side-session-history.md).
- **`/models` never 500s** on provider errors — it falls back to the default model.
