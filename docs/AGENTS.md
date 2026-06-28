# Working in this repo as a coding agent

This file tells AI coding agents (Claude Code, Cursor, Windsurf, Copilot, Aider,
etc.) how to work here. It is tool-agnostic — the top-level README summarizes
these rules too.

## Before you start

1. Read the relevant [`conventions/`](conventions/) files for what you're changing.
2. Read the [`services/`](services/) file for the affected unit (`api` or `ui`).
3. If the change is non-trivial (more than one file), write a short plan and get
   it approved before editing. See [`conventions/work-protocol.md`](conventions/work-protocol.md).

## House rules

- **Match the existing style.** This codebase has a consistent shape — follow it
  rather than introducing a new pattern. When in doubt, copy the nearest sibling.
- **Keep layers honest.** Routers stay thin and delegate to services; services
  orchestrate; repositories own I/O. Don't put a model call in a router or HTTP
  parsing in a service.
- **New external dependency = a decision.** Storage backends, model providers,
  and the like sit behind repository interfaces. Add an implementation, don't
  rewire callers. If it changes a rule, write an ADR in [`decisions/`](decisions/).
- **Verify, don't assert.** "It builds" is not "it works." Run it:
  `uv run pytest` for the API, `npm run build` for the UI, and exercise the
  endpoint or page you changed.
- **No proprietary or cloud-coupled content.** This is a public template. No
  vendor lock-in, secrets, or company-specific naming.

## Definition of done

A change is done when **all** hold:

- It follows the conventions (or an ADR justifies the deviation).
- Tests pass (`uv run pytest`) and the UI builds (`npm run build`).
- The thing it changes runs end-to-end and the result is inspectable.
- Docs are updated if behavior or a convention changed.

## What this repo is NOT

- Not a place for half-finished files. If it exists, it should work.
- Not a dumping ground for clever abstractions. Prefer boring and obvious.
