# CLAUDE.md

Guidance for Claude Code (and other coding agents) working in this repo.

## What this is

A compact full-stack AI template: a FastAPI backend (`api/`, package `app`) with
a provider-agnostic LLM client, and a React + Vite + TypeScript + Tailwind
frontend (`ui/`). It runs locally with one command and works fully offline
against a local model.

## Read this before working

Project documentation lives in [`docs/`](docs/):

1. [`docs/AGENTS.md`](docs/AGENTS.md) — how to work here as an agent.
2. [`docs/conventions/`](docs/conventions/) — the coding conventions (authoritative).
3. [`docs/services/`](docs/services/) — the unit you're touching (`api` or `ui`).
4. [`docs/decisions/`](docs/decisions/) — *why* the design is what it is.

## The short version

- **Thin layers.** Routers delegate to services; services orchestrate;
  repositories own I/O. Don't cross those lines.
- **Talk to the model only through `LlmRepository`**, and to storage only through
  `SessionRepository`. The provider and the datastore are swappable behind those.
- **`@log_activity` on functions in the request path.** No `print`.
- **Config is one typed `Settings` object** driven by env vars; secrets never go
  in code or the `/settings` response.
- **Verify, don't assert.** `cd api && uv run pytest` and `cd ui && npm run build`
  must stay green. Run the thing you changed.
- **No proprietary or cloud-coupled content** — this is a public template.

If you change a convention, update [`docs/conventions/`](docs/conventions/) and
add an ADR in [`docs/decisions/`](docs/decisions/).
