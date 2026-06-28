# Deployment

🧭 **Suggested** — this template runs locally and in Docker; it is deliberately
not bound to any cloud. This page is the menu of where it *can* go, and how I'd
choose, since the app is twelve-factor and cloud-agnostic.

## What the app needs from any platform

1. Run two containers (`api`, `ui`) and route HTTP to them.
2. Inject env vars / secrets at runtime (`OPENAI_*`, `API_ACCESS_KEY`, …).
3. Reach the chosen model provider (egress to OpenAI, or a colocated Ollama/vLLM).
4. A place for session state **once you outgrow in-memory** — see
   [`../patterns/redis-session-repository.md`](../patterns/redis-session-repository.md).

That's it. Anything that satisfies those four runs this app.

## Options, with trade-offs

| Target | Good for | Trade-off |
|---|---|---|
| **Single VM + Docker Compose** | demos, internal tools, lowest cost | manual scaling, you own the host |
| **Managed container service** (Cloud Run, ACA, App Runner, Fly.io) | small teams, scale-to-zero, no cluster ops | per-platform config; cold starts |
| **Kubernetes** | many services, fine-grained scaling, existing platform | operational weight; only worth it past a few services |
| **Static UI + serverless API** | spiky traffic, cheap idle | API cold starts; rework if you add long-lived workers |

**My default for a project this size:** a managed container platform — push two
images, set env vars, get TLS and autoscaling without running a cluster. Move to
Kubernetes only when the service count and team justify the platform overhead.

## Kubernetes sketch 🧭

Two `Deployment`s + `Service`s, an `Ingress` terminating TLS and routing `/` to
the UI and `/api` to the API, secrets from a `Secret` (sourced from a real
secret manager via External Secrets / CSI):

```
Ingress (TLS)
  ├── /        → ui   Service → Deployment (nginx + static bundle)
  └── /api     → api  Service → Deployment (uvicorn)  ── env from Secret
                                                       └── Redis (session store)
```

- API `readinessProbe` / `livenessProbe` → `GET /ping`.
- `HorizontalPodAutoscaler` on the API by CPU / request rate.
- Session state externalized to Redis so API pods stay stateless and scale
  horizontally.

## The one thing to change before scaling

In-memory sessions don't survive multiple replicas. Swap
`InMemorySessionRepository` for a shared store **before** you run more than one
API pod — it's a single-line construction change behind the existing interface.
See [`../patterns/`](../patterns/).
