# Conventions

How we write code in this repo. These are authoritative — code that disagrees
with a convention is either a bug to fix or a convention to change via an ADR in
[`../decisions/`](../decisions/).

| File | Covers |
|---|---|
| [code-style.md](code-style.md) | Naming, types, imports, comments, file layout |
| [routers.md](routers.md) | FastAPI router composition and handler shape |
| [repositories.md](repositories.md) | The repository pattern for storage and the LLM client |
| [logging.md](logging.md) | `@log_activity`, structured logs, trace/session ids |
| [configuration.md](configuration.md) | `pydantic-settings`, env vars, secrets |
| [llm-usage.md](llm-usage.md) | The provider-agnostic, OpenAI-compatible model client |
| [frontend.md](frontend.md) | React/TypeScript/Tailwind conventions and the API client |
| [testing.md](testing.md) | What we test and how (mocking the LLM) |
| [git-workflow.md](git-workflow.md) | Branches, commits, PRs |
| [work-protocol.md](work-protocol.md) | How non-trivial changes get made (plan, verify, decide) |

Read them all on day one — they're short.
