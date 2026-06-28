# Pattern — Vector-store repository (RAG)

🧭 **Example** — not shipped. Shows how to add a *new* repository type and wire
retrieval-augmented generation into the chat flow, following the same seams.

## Idea

Retrieve relevant document chunks for the user's question and prepend them to the
model call as grounding context. The retrieval backend (pgvector, Qdrant, Chroma,
Pinecone, …) sits behind a `VectorStoreRepository` interface, exactly like the
LLM and session stores — so the provider is swappable.

## The interface

```python
# app/repositories/vector_store_repository.py  (example)
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class RetrievedChunk:
    text: str
    source: str
    score: float


class VectorStoreRepository(ABC):
    """Semantic retrieval over an indexed corpus."""

    @abstractmethod
    def add(self, text: str, source: str) -> None:
        """Embed and index a chunk of text."""

    @abstractmethod
    def search(self, query: str, k: int = 4) -> list[RetrievedChunk]:
        """Return the k most relevant chunks for a query."""
```

A concrete impl embeds with the same OpenAI-compatible client (reusing
`OPENAI_BASE_URL`) and stores vectors in the chosen backend. Keeping embeddings
on the existing provider means RAG also works fully offline against Ollama.

## Wiring retrieval into the chat flow

`ChatService.send_message` gains one retrieval step before the model call —
additive, and easy to gate behind a flag:

```python
# app/services/chat_service.py  (excerpt, example)
messages = [{"role": "system", "content": chat_system_prompt}]

if settings.rag_enabled:
    chunks = vector_store_repository.search(request.user_query, k=4)
    if chunks:
        context = "\n\n".join(f"[{c.source}]\n{c.text}" for c in chunks)
        messages.append({
            "role": "system",
            "content": f"Use the following context to answer.\n\n{context}",
        })

messages += session_repository.get_history(session_id)
answer = LlmRepository.chat(messages, model_name=request.model_name)
```

## Why this stays clean

- **New capability, same shape.** RAG is a new repository + one service step, not
  a rewrite. Routers and the API contract are unchanged.
- **Swappable backend.** Dev on Chroma/pgvector locally; switch to a managed
  vector DB in prod by changing the construction line.
- **Offline-friendly.** Embeddings go through the same provider-agnostic client.
- **Observable for free.** `@log_activity` on the repo methods puts retrieval in
  the same trace as the chat request.

## What a full feature would add

- An ingestion path (chunking + embedding of source documents) — likely a small
  background worker; see [`../services/example-worker.md`](../services/example-worker.md).
- A `sources` field on the chat response so the UI can show citations.
- An eval harness measuring retrieval quality before shipping.
