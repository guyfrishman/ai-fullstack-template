# Patterns

Reusable, proven patterns and **worked examples** of extending the template.
Everything here is 🧭 **example / not shipped** — it shows *how* the seams in the
codebase are meant to be used, without bloating the starter.

The theme: the app depends on **interfaces**, so growing it means adding an
implementation, not rewiring callers. See
[`../conventions/repositories.md`](../conventions/repositories.md).

| Pattern | What it shows |
|---|---|
| [redis-session-repository.md](redis-session-repository.md) | A drop-in `SessionRepository` backed by Redis — survives restarts, shared across replicas |
| [postgres-session-repository.md](postgres-session-repository.md) | A durable, queryable `SessionRepository` on Postgres |
| [vector-store-repository.md](vector-store-repository.md) | A *new* repository type for RAG — retrieval wired into the chat flow |

## How to add a pattern

1. Build it in a feature branch behind the relevant interface.
2. Once it's proven, document it here as a worked example.
3. If it changes a rule or a default, record an ADR in
   [`../decisions/`](../decisions/).
