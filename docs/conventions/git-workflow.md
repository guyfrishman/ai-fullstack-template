# Git Workflow

Lightweight, since this is a template. Scale it up as a real project grows.

## Branches

- `main` is always runnable: tests pass, the UI builds.
- Do work on short-lived feature branches: `feature/<short-desc>`,
  `fix/<short-desc>`.

## Commits

- Imperative, present tense: "Add chat session reset", not "Added" / "Adds".
- One logical change per commit. Keep them reviewable.
- Reference an ADR in the body when a commit implements a decision.

## Before you push

Run the same checks CI would:

```bash
cd api && uv run pytest
cd ui  && npm run build
```

A red build or failing test doesn't get pushed to `main`.

## Pull requests

- Describe *what* changed and *why*. Link the relevant convention or ADR.
- If the change alters a convention, the PR must also update
  [`../conventions/`](.) and add an ADR in [`../decisions/`](../decisions/).

## What not to commit

- No real `.env` — only `.env.example` is tracked.
- No build output (`dist/`), dependencies (`node_modules/`, `.venv/`), or IDE
  files. The root [`.gitignore`](../../.gitignore) covers these.
