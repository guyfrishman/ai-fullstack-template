# Services

One file per deployable unit: what it is, how to run it, and any quirks. Update
the relevant file whenever a unit ships a meaningful change.

## Implemented ✅

| Unit | Doc | Stack |
|---|---|---|
| Backend API | [api.md](api.md) | FastAPI · Python 3.12 · uv |
| Frontend UI | [ui.md](ui.md) | React · TypeScript · Vite · Tailwind |

Both run together via `docker compose up` from the repo root.

## Example / planned 🧭

Illustrative service docs showing how the system would grow into a small
multi-service architecture. These are **not implemented** — they demonstrate the
shape a new service would take and how it slots into the existing patterns.

| Unit | Doc | Purpose |
|---|---|---|
| Background worker | [example-worker.md](example-worker.md) | Async/long-running jobs off the request path |
| RAG / retrieval API | [example-rag-api.md](example-rag-api.md) | Document ingestion + semantic search for grounding |

## Adding a new service

Copy [`_template.md`](_template.md), fill it in, and add a row above. A new
service should reuse the existing conventions — routers, repositories, logging,
config — so it looks like the ones already here.
