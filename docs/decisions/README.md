# Architecture Decision Records

*Why* the project is built the way it is. Each ADR captures the context, the
decision, and the trade-offs at the time it was made.

**Append-only.** Never edit or delete an ADR. If a decision is reversed, add a
new ADR that supersedes the old one and link them. The trail matters.

| ADR | Decision |
|---|---|
| [0001](0001-provider-agnostic-llm-client.md) | Provider-agnostic, OpenAI-compatible LLM client |
| [0002](0002-server-side-session-history.md) | Conversation history lives server-side behind a repository |
| [0003](0003-optional-api-key-auth.md) | API-key auth is a no-op when unset (open locally) |
| [0004](0004-uv-and-pydantic-settings.md) | uv for packaging, pydantic-settings for config |

## Format

Copy an existing file. Each ADR has: a dated title, **Status**, **Context**,
**Decision**, **Consequences** (good and bad), and optionally **Alternatives
considered**.
