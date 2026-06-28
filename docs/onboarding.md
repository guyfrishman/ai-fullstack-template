# Onboarding

Welcome. This is a compact, end-to-end AI app: a FastAPI backend with a
provider-agnostic LLM client, and a React + Vite + TypeScript + Tailwind
frontend. The goal of this page is to get you productive in under an hour.

## Day-1 reading list

1. The top-level [`README.md`](../README.md) — what the project is and how to run it.
2. This file.
3. [`conventions/`](conventions/) — read all of them; they're short.
4. The [`services/`](services/) file for the part you're touching (`api` or `ui`).
5. Skim [`decisions/`](decisions/) to understand *why* the design is the way it is.

## Get it running (5 minutes)

```bash
# Backend
cd api
cp .env.example .env
uv sync
uv run uvicorn main:app --reload      # http://localhost:8000/docs

# Frontend (new terminal)
cd ui
cp .env.example .env
npm install
npm run dev                            # http://localhost:5173
```

No API key is required to run locally — auth is a deliberate no-op until
`API_ACCESS_KEY` is set (see [`conventions/configuration.md`](conventions/configuration.md)).

You can run the model layer fully offline with [Ollama](https://ollama.com) — see
[`conventions/llm-usage.md`](conventions/llm-usage.md).

## Mental model

```
Browser (React)
   │  POST /api/v1/chat/send_message  { user_query, session_id }
   ▼
FastAPI router  ──►  ChatService  ──►  SessionRepository (history)
                                   └►  LlmRepository (OpenAI-compatible call)
```

- The **browser sends only the latest turn**; the server stores conversation
  history under a `session_id` and replays it to the model.
- Storage and the model client both sit behind **repository interfaces**, so
  either can be swapped without touching the service layer.

## The layout

```
api/app/
├── config.py          # typed settings (env-driven)
├── logger.py          # @log_activity + session/trace ContextVars
├── security.py        # X-API-Key dependency
├── routers/           # thin HTTP handlers, composed in api.py
├── services/          # orchestration (no transport concerns)
├── repositories/      # storage + LLM client behind interfaces
├── schema/            # pydantic request/response models
└── prompts/           # system prompts

ui/src/
├── App.tsx            # shell + routes
├── components/        # Sidebar, ...
├── pages/             # Chatbot, About
└── lib/               # api client, config, constants
```

## How work gets done here

See [`conventions/work-protocol.md`](conventions/work-protocol.md). In short:
plan first, work one verifiable step at a time, and don't move on until the
current step actually runs.
