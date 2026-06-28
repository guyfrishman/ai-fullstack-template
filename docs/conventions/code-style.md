# Code Style

## The rules

1. **Self-documenting names first.** A function that does X is called `do_x()`.
   Names carry the meaning; reach for a comment only when the *why* isn't obvious
   from the code.
2. **Comment the *why*, not the *what*.** Short docstrings on public functions,
   classes, and repository interfaces are welcome (they also feed OpenAPI). Skip
   comments that just restate the code.
3. **One concept per file.** `llm_repository.py` only talks to the model;
   `session_repository.py` only stores sessions. Don't mix concerns.
4. **Pydantic v2 for data that crosses a boundary** (HTTP, function calls between
   layers). Request/response models live in `app/schema/`.
5. **Thin layers.** Routers delegate to services; services orchestrate;
   repositories own I/O. See [routers.md](routers.md) and [repositories.md](repositories.md).
6. **No clever metaprogramming.** No deep inheritance, no DI ceremony. Prefer
   boring and obvious.
7. **No `print` in app code.** Use the logger — see [logging.md](logging.md).
8. **Match the existing style.** If the codebase does it a certain way, do it
   that way too.

## Python

- Python 3.12, dependencies managed with [uv](https://docs.astral.sh/uv/).
- Modern type hints: `dict`, `list`, `str | None` — not `Dict`, `List`, `Optional`.
- `from typing import Literal` for restricted string sets.
- `pydantic_settings.BaseSettings` for env config (see [configuration.md](configuration.md)).

## Imports

- Standard library, then third-party, then local — one blank line between groups.
- Absolute imports within the `app` package (`from app.services... import ...`).
- No wildcard imports.

## Naming

- Files: `snake_case.py`. Classes: `PascalCase`. Functions/vars: `snake_case`.
  Constants: `UPPER_SNAKE_CASE`.
- Router handler functions are the one place names stay **short** verb-nouns
  (`send_message`, `list_models`) because the path + `summary=` already describe
  the action. See [routers.md](routers.md).

## Frontend

TypeScript/React conventions live in [frontend.md](frontend.md).

## When code disagrees with this doc

The code is wrong — fix it. If you think the rule is wrong, write an ADR in
[`../decisions/`](../decisions/) before changing the code.
