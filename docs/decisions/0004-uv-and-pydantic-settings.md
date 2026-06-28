# 0004 — uv for packaging, pydantic-settings for config

**Status:** Accepted

## Context

Two small foundational choices: the Python package/dependency manager, and how
configuration is read.

## Decision

- **[uv](https://docs.astral.sh/uv/)** for dependency management and running the
  app (`uv sync`, `uv run ...`), with a committed `uv.lock` for reproducibility.
- **`pydantic-settings.BaseSettings`** as the single typed `Settings` object,
  driven by environment variables, with safe defaults so the app boots on an
  empty `.env`.

## Consequences

**Good:**
- uv is fast and resolves + locks deterministically; the lockfile makes the
  Docker build reproducible (`uv sync --frozen --no-dev`).
- One typed settings object means config is discoverable and validated — no
  scattered `os.getenv` with stringly-typed defaults.

**Bad:**
- uv is newer than pip/Poetry; contributors may need to install it once. The
  payoff in speed and reproducibility is worth the one-time step.

## Notes

Config conventions are in [`../conventions/configuration.md`](../conventions/configuration.md).
