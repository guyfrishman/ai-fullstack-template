# 0002 — Conversation history lives server-side behind a repository

**Status:** Accepted

## Context

A chat needs conversation context. Two common shapes:
1. The **client** holds the history and sends the full transcript with every
   request (stateless server).
2. The **server** holds the history keyed by a session id; the client sends only
   the latest turn.

## Decision

The **server** owns history, stored behind a `SessionRepository` interface. The
shipped implementation is `InMemorySessionRepository`. `ChatService.send_message`
appends the user turn, replays the full history to the model, and stores the
reply.

This showcases the repository pattern — the seam where an in-memory store can be
replaced by Redis/Postgres with no change to the service or routers.

## Consequences

**Good:**
- Demonstrates a clean, swappable storage boundary — the central teaching point
  of the template.
- The client stays thin: it sends one turn and a session id.
- A persistent or multi-device history is a drop-in implementation away.

**Bad:**
- In-memory history is lost on restart and isn't shared across replicas. This is
  acceptable for a local template and is exactly what the interface exists to fix
  in production.
- On reload the browser starts a fresh session (it doesn't persist the id). A
  follow-up could store the `session_id` client-side to resume — deliberately
  left out to keep the first version minimal.

## Alternatives considered

- **Client-sent transcript (stateless server):** simpler server, but pushes
  state and trimming logic into the client and hides the storage seam the
  template means to demonstrate. Rejected.
