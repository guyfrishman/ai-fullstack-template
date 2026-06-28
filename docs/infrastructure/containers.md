# Containers

## What's implemented ✅

- **`api/Dockerfile`** — multi-stage build. Stage 1 uses `uv sync --frozen
  --no-dev` against the lockfile for a reproducible, dev-dependency-free venv;
  stage 2 copies just the venv into a slim runtime image. No build toolchain
  ships in the final image.
- **`ui/Dockerfile`** — multi-stage. Node stage runs `npm ci && npm run build`;
  the static `dist/` is served by a plain `nginx:alpine`. `VITE_API_BASE_URL` is
  a build arg baked into the bundle.
- **`docker-compose.yml`** — brings `api` + `ui` up together with one command,
  wiring CORS and ports.

```bash
docker compose up --build      # api on :8000, ui on :5173
```

## Image strategy 🧭

- **Pin base images by digest** in production (`python:3.12-slim@sha256:…`) so a
  moved tag can't change a build out from under you.
- **One service per image**, each with its own Dockerfile and lifecycle. The
  Compose file is for local orchestration, not a production deployment unit.
- **Tag with the immutable git tag / SHA**, never just `latest`. The artifact
  built in CI is the one promoted (see [ci-cd.md](ci-cd.md)).
- **Non-root runtime user** and a read-only root filesystem where possible.
- **Healthcheck** baked into the image so the platform can gate traffic:

  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=3s \
    CMD python -c "import urllib.request,sys; \
      sys.exit(0) if urllib.request.urlopen('http://localhost:8000/ping').status==200 else sys.exit(1)"
  ```

## Compose for local, manifests for prod 🧭

`docker-compose.yml` is the local developer experience. For production, the same
images are described by environment-specific manifests (Kubernetes, or a managed
container platform's spec) — see [deployment.md](deployment.md). Keep the two
concerns separate; don't try to make one Compose file serve both.
