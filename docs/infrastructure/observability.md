# Observability

## What's implemented ✅

**Structured JSON logging** via the `@log_activity` decorator and `log_metric`
(see [`../conventions/logging.md`](../conventions/logging.md)). Every request
emits machine-parseable lines tagged with `session_id` and `trace_id`, so a
single request is traceable across the call graph. Token usage is emitted as
`METRIC` lines.

That alone covers the "what happened and why did it fail" question in
development and small deployments.

## The path to production observability 🧭

The three pillars, in the order I'd add them:

### 1. Logs (have it) → ship them

JSON logs to stdout is the right format already. In production, point the
platform's log agent (Fluent Bit / Vector / Grafana Alloy) at stdout and ship to
a store (Loki, CloudWatch, ELK). Map the JSON `status` field to a log `level`
label so `ERROR` lines are alertable.

### 2. Metrics

Add a Prometheus endpoint and track the golden signals:

- **Rate / errors / duration** per route (RED method).
- **LLM-specific**: tokens per request, provider latency, model-fallback count
  (the `log_metric` lines already capture the raw data — promote them to
  counters/histograms).

```python
# sketch — prometheus-fastapi-instrumentator
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)   # GET /metrics
```

### 3. Traces

Wrap the app with OpenTelemetry to get distributed traces across the API →
provider (and any future worker) hops. The `trace_id` already in the logs gives
log↔trace correlation once OTel is wired:

```
opentelemetry-instrument uvicorn main:app   # no app code change to start
```

## Health & SLOs 🧭

- **`GET /ping`** is the liveness/readiness probe today.
- Add a **`/health`** that checks the model provider and the session store
  (degraded vs down) for a richer readiness signal.
- Suggested starter SLOs once metrics exist: API availability 99.5%, p95
  non-LLM latency < 300 ms (LLM latency tracked separately — it's provider-bound).

## Why it's staged, not shipped

Wiring metrics and tracing into a starter adds dependencies and a collector to
run, for signal you only need at scale. The structured logs give you most of the
value on day one; this page is the runway for the rest.
