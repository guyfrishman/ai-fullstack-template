# example-worker — background job processor

**Path:** `worker/` (example) · **Status:** 🧭 planned / illustrative

> Not implemented. This doc shows how an async worker would slot into the
> architecture once work needs to happen **off the request path**.

## What it does

Consumes jobs from a queue and runs work that's too slow or too bursty for an
HTTP request: embedding documents for RAG, batch summarization, scheduled syncs,
sending notifications. The API enqueues; the worker processes; results land in a
store the API can read.

## Why a separate service

- **Keeps the API responsive.** Long tasks don't block request handlers or risk
  HTTP timeouts.
- **Scales independently.** Queue depth drives worker replicas; request rate
  drives API replicas. Different signals, different scaling.
- **Retries & durability.** A queue gives at-least-once delivery and a
  dead-letter path for poison messages.

## Shape

```
API  ──enqueue──►  Queue  ──►  worker  ──►  store (Postgres / object storage / vector DB)
(Redis / SQS / RabbitMQ / NATS)
```

```
worker/
├── main.py            # consumer loop: pull → dispatch → ack / dead-letter
├── app/
│   ├── config.py      # same pydantic-settings pattern as the API
│   ├── logger.py      # SAME @log_activity — trace_id flows from the enqueued job
│   ├── handlers/      # one handler per job type (verb-noun, thin)
│   └── repositories/  # reuse the API's repository interfaces
```

## Conventions it reuses

- **`@log_activity` + `trace_id`** — the enqueuing request's `trace_id` travels
  in the job payload, so a job's logs join the originating request's trace (see
  [`../conventions/logging.md`](../conventions/logging.md)).
- **Repository interfaces** — the worker writes through the same
  `SessionRepository` / `VectorStoreRepository` the API uses; no duplicate I/O code.
- **Config** — one typed `Settings`, env-driven, same as the API.

## Quirks

- **Idempotent handlers.** At-least-once delivery means a job can run twice;
  handlers must tolerate it (upsert, dedupe by job id).
- **Dead-letter with a reason.** A poison message goes to the DLQ with a
  machine-groupable reason + human description, never silently dropped.
- **Graceful shutdown.** Finish the in-flight job and ack before exiting so work
  isn't lost on deploy.

## Trade-off worth recording

Adding a queue + worker is real operational weight. For a small app, a FastAPI
`BackgroundTasks` or a single async task may be enough. Promote to a dedicated
worker when jobs are slow, must survive restarts, or need independent scaling —
and record the call as an ADR in [`../decisions/`](../decisions/).
