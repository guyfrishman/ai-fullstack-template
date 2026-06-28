# AI Fullstack Template

A clean, production-shaped starting point for AI applications: a **FastAPI**
backend with a provider-agnostic LLM client, and a **React + Vite + TypeScript +
Tailwind** frontend with a working chat UI. Runs locally with one command, and
works fully offline against a local model.

```
ai-fullstack-template/
├── api/                 # FastAPI service (package: app)
├── ui/                  # React + Vite + TypeScript + Tailwind
├── docker-compose.yml   # api + ui, one command
├── LICENSE              # MIT
└── README.md
```

![Chatbot page](docs/screenshots/chatbot.png)

<details>
<summary>More screenshots</summary>

![About page](docs/screenshots/about.png)

</details>

## Why this template

It demonstrates a small set of patterns that scale well as a service grows:

- **Router composition** — each feature is a bare `APIRouter()`; a single
  `routers/api.py` composes them under `/api/v1` with `prefix`/`tags`. Handlers
  stay short and verb-noun; every route has a `summary`.
- **Repository pattern** — storage sits behind interfaces. `SessionRepository`
  is abstract with an in-memory implementation shipped; a DB-backed store drops
  in without touching the service layer. The LLM client is its own repository,
  so the provider is an implementation detail.
- **Provider-agnostic LLM** — one OpenAI-compatible client. Point it at OpenAI,
  a local **Ollama**, vLLM, LM Studio — anything that speaks the OpenAI
  protocol. Switching providers is an `.env` change, not a code change.
- **Config** — `pydantic-settings` with a single typed `Settings` object,
  driven entirely by environment variables.
- **Structured logging** — a `@log_activity` decorator emits JSON
  STARTING/FINISHED/ERROR lines, tagged with request-scoped `session_id` and
  `trace_id` via `ContextVars`, so a request is traceable across async calls.
- **Security** — an `X-API-Key` dependency guards `/api/v1/*`. It is a **no-op
  (open) when `API_ACCESS_KEY` is unset**, so local development needs no keys;
  set the key to lock the API down.
- **Graceful degradation** — `GET /api/v1/models` lists what the provider
  serves, and falls back to the default model if the provider can't be reached,
  rather than returning a 500.

## API surface

| Method | Path                        | Auth        | Description                       |
| ------ | --------------------------- | ----------- | --------------------------------- |
| GET    | `/ping`                     | open        | Liveness check                    |
| POST   | `/api/v1/chat/init`         | key (if set)| Create a chat session             |
| POST   | `/api/v1/chat/send_message` | key (if set)| Send a message, get a reply       |
| GET    | `/api/v1/models`            | key (if set)| List available models             |
| GET    | `/api/v1/settings`          | key (if set)| Safe, non-secret configuration    |

## Quickstart

### Option 1 — Docker Compose (both services)

```bash
cp api/.env.example api/.env     # then edit api/.env with your provider settings
docker compose up --build
```

- UI: http://localhost:5173
- API docs: http://localhost:8000/docs

### Option 2 — Run each service manually

**API** (needs [uv](https://docs.astral.sh/uv/)):

```bash
cd api
cp .env.example .env
uv sync
uv run uvicorn main:app --reload      # http://localhost:8000
```

**UI** (needs Node 20+):

```bash
cd ui
cp .env.example .env
npm install
npm run dev                            # http://localhost:5173
```

## Choosing a model provider

The backend uses one OpenAI-compatible client. Configure it in `api/.env`:

**OpenAI**

```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
DEFAULT_MODEL=gpt-4o-mini
```

**Local / offline with Ollama** — no API key, nothing leaves your machine:

```bash
ollama pull llama3.2
ollama serve
```

```env
OPENAI_BASE_URL=http://localhost:11434/v1
DEFAULT_MODEL=llama3.2
```

That's the only change needed to go fully offline.

## Tests

```bash
cd api && uv run pytest
```

Tests mock the LLM client, so they run with no network and no API key.

## Documentation

In-depth docs for contributors and coding agents live in [`docs/`](docs/):

- [`docs/onboarding.md`](docs/onboarding.md) — get productive in under an hour
- [`docs/conventions/`](docs/conventions/) — how the code is written (routers, repositories, logging, config, LLM usage, frontend, testing)
- [`docs/decisions/`](docs/decisions/) — architecture decision records (the *why*)
- [`docs/services/`](docs/services/) — per-unit reference for `api` and `ui`
- [`docs/AGENTS.md`](docs/AGENTS.md) — how AI coding agents should work here (the root [`CLAUDE.md`](CLAUDE.md) points to it)

## License

MIT — see [LICENSE](LICENSE).
