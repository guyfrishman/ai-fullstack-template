# Infrastructure

How this template builds, ships, and runs — what's **implemented today** and a
**suggested path** for taking it to production.

> **Status legend**
> - ✅ **Implemented** — exists in this repo, works now.
> - 🧭 **Suggested** — a documented, opinionated path; not wired up here. These
>   sections show *how I'd take this to production*, kept out of the template so
>   it stays minimal and cloud-agnostic.

| Doc | Covers | Status |
|---|---|---|
| [ci-cd.md](ci-cd.md) | GitHub Actions CI (test + build); suggested CD | ✅ CI / 🧭 CD |
| [containers.md](containers.md) | Dockerfiles, Compose, image strategy | ✅ / 🧭 |
| [deployment.md](deployment.md) | Where it runs: container platforms, K8s, serverless | 🧭 |
| [observability.md](observability.md) | Logs → metrics → traces, health & SLOs | ✅ logs / 🧭 rest |

## Design principles

- **Cloud-agnostic by default.** The app is twelve-factor: config from env,
  stateless API, storage behind an interface. It runs the same on a laptop, a
  single VM, a container platform, or Kubernetes — no vendor lock-in.
- **Reproducible builds.** Pinned dependencies (`uv.lock`, `package-lock.json`)
  and multi-stage Docker builds give identical artifacts everywhere.
- **The same checks locally and in CI.** `uv run pytest` and `npm run build` are
  what CI runs — no surprises between dev and the pipeline.
- **Secrets never in the image or repo.** Injected at runtime from the platform's
  secret store; only `.env.example` is tracked.
