# Logging

## Rule

**`@log_activity` on every function in the request call path** — handlers,
services, and repository methods. It's the cheapest observability you'll ever buy.

The decorator lives in `app/logger.py`. It emits structured JSON with:
- `status`: `STARTING`, `FINISHED`, or `ERROR`
- `process`: the function name
- `session_id`, `trace_id`: pulled from `ContextVar`s, initialized at the entry
  point of each request
- `input` / `output`: arguments and return value, truncated for large payloads

## Why

When something breaks, the log stream should tell you, without a debugger:
1. Which request failed (`trace_id`).
2. Which session it belonged to (`session_id`).
3. Where in the call stack it failed (the `STARTING` with no matching `FINISHED`).
4. What inputs caused it (`input`).

Logging selectively misses this. Logging the whole call path catches it.

## Usage

```python
from app.logger import log_activity

@log_activity
async def send_message(request: ChatRequest) -> ChatResponse:
    ...
```

Works for both sync and async functions — the decorator detects which and wraps
accordingly.

## Truncation

Strings longer than `MAX_STR_LOG_LENGTH` (default 200) are truncated; large bytes
are summarized; dicts and lists are truncated recursively. This keeps logs
readable and avoids dumping whole documents into the stream.

## `log_metric` — sparse, chartable events

Use `log_metric(...)` for high-level things worth charting (token counts,
fallbacks), not per-step state:

```python
log_metric(model=model, total_tokens=usage.total_tokens)
log_metric(outcome="model_list_unavailable", error=str(e))
```

These carry `"status": "METRIC"`. Difference from `@log_activity`:
- `@log_activity` → automatic, every function, traces the call graph.
- `log_metric` → manual, sparse, for dashboards.

## Don'ts

- **Don't** use `print(...)`.
- **Don't** use the stdlib `logging` module directly — use `app.logger`.
- **Don't** decorate Pydantic models. Decorate functions, not data shapes.
- **Don't** log secrets. The decorator truncates but does not redact — pass
  secrets via env vars, never as function arguments.

## `LOG_LEVEL`

Default `INFO`. `INFO` emits thin status lines; `DEBUG` adds full (truncated)
inputs and outputs. Keep deployed services at `INFO` to control volume.

## ContextVar lifetime

`session_id` / `trace_id` are `contextvars.ContextVar`s. The first decorated
function in a call chain initializes them (preferring values from the request,
falling back to a UUID); inner functions inherit them; the outermost clears them
on exit. If you spawn a background thread, copy the context into it manually or
the thread sees `"n/a"`.
