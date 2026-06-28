# Documentation

The single source of truth for how this project is built and how to work in it —
for **humans onboarding** and for **coding agents** (Claude Code, Cursor, etc.).

If you're unsure how something is structured, or *why* it's structured that way,
the answer is here.

## Who reads this

- **New contributors** — start with [`onboarding.md`](onboarding.md).
- **Coding agents** — read [`AGENTS.md`](AGENTS.md) first, then the relevant
  `conventions/` files. The repo root also has a `CLAUDE.md` that points here.
- **Reviewers / the curious** — `decisions/` explains the *why* behind the design.

## What lives where

| Folder | What's in it |
|---|---|
| **[conventions/](conventions/)** | How we write code. Code style, routers, repositories, logging, config, LLM usage, frontend, testing, git. Authoritative. |
| **[decisions/](decisions/)** | Architecture Decision Records — *why* we chose what we chose. Append-only; never rewrite history. |
| **[services/](services/)** | One file per deployable unit (`api`, `ui`): what it does, how to run it, quirks. |
| **screenshots/** | Images used by the top-level README. |

## How to use this with coding agents

This repo is designed to be agent-friendly:

- **Claude Code** — `CLAUDE.md` at the repo root is read automatically and points
  here. At session start, an agent should read `docs/AGENTS.md` and the
  `conventions/` files relevant to the change.
- **Cursor / Windsurf** — open the repo; the same docs apply.
- **Any LLM** — paste the relevant `conventions/*.md` file into context.

## Maintainer notes

- **Conventions are the law.** If the code disagrees with a convention doc,
  either the code is wrong (fix it) or the convention changed (write an ADR in
  `decisions/`, update the convention, then fix the code).
- **`decisions/` is append-only.** If a decision is reversed, add a new ADR that
  supersedes the old one and link it. Don't delete the trail.
- **Keep it scannable.** Tables and short prose beat long paragraphs. Optimize
  for "I need the answer in 30 seconds."
