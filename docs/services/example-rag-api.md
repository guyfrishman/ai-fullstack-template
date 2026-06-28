# example-rag-api — retrieval & document ingestion

**Path:** `rag-api/` (example) · **Status:** 🧭 planned / illustrative

> Not implemented. This doc shows how retrieval-augmented generation would be
> added as its own service, reusing the template's patterns end to end.

## What it does

Ingests documents (chunk → embed → index) and exposes semantic search. The chat
API calls it to ground answers in a corpus. See the code-level pattern in
[`../patterns/vector-store-repository.md`](../patterns/vector-store-repository.md).

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/documents/ingest` | key if set | Chunk, embed, and index a document |
| POST | `/api/v1/search` | key if set | Top-k semantic search for a query |
| GET | `/api/v1/collections` | key if set | List indexed collections |

Same router/handler conventions as the main API
([`../conventions/routers.md`](../conventions/routers.md)).

## Layout

```
rag-api/
├── main.py
├── app/
│   ├── routers/        # documents, search — thin, composed in api.py
│   ├── services/       # IngestionService, SearchService
│   ├── repositories/
│   │   ├── vector_store_repository.py   # the new repository type
│   │   └── llm_repository.py            # reused for embeddings (OpenAI-compatible)
│   ├── schema/
│   └── config.py
```

## How it fits the system

```
UI ──► chat API ──► RAG api (/search) ──► vector store
                         ▲
       ingestion ────────┘  (sync, or via example-worker for large corpora)
```

- **Embeddings reuse the provider-agnostic client** — point `OPENAI_BASE_URL` at
  Ollama and ingestion + retrieval run fully offline, no separate embedding vendor.
- **Retrieval is one repository behind an interface** — swap pgvector ↔ Qdrant ↔
  a managed vector DB without touching services.
- **Heavy ingestion offloads to the worker** — see
  [`example-worker.md`](example-worker.md).

## Why a separate service (vs. folding into the API)

- Different scaling profile (embedding/indexing is CPU/GPU-heavy and bursty).
- Independent deploy cadence as the retrieval stack evolves.
- Clear ownership boundary for the knowledge base.

For a small corpus, the same capability can live **inside** the chat API as the
RAG step shown in [`../patterns/vector-store-repository.md`](../patterns/vector-store-repository.md).
Split it out when ingestion volume or scaling needs justify it — and record the
decision as an ADR.
