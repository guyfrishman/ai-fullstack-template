# Services

One file per deployable unit: what it is, how to run it, and any quirks. Update
the relevant file whenever a unit ships a meaningful change.

| Unit | Doc | Stack |
|---|---|---|
| Backend API | [api.md](api.md) | FastAPI · Python 3.12 · uv |
| Frontend UI | [ui.md](ui.md) | React · TypeScript · Vite · Tailwind |

Both run together via `docker compose up` from the repo root.
