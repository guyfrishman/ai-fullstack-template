# CI / CD

## CI — implemented ✅

[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs on every push
and pull request to `main`. Two parallel jobs mirror exactly what you run locally:

| Job | Steps |
|---|---|
| **api** | install uv → `uv sync --dev` → `uv run pytest -v` |
| **ui** | `npm ci` → `npm run build` (runs `tsc` type-check + Vite bundle) |

Why this shape:
- **Parallel jobs** fail fast and independently — a UI type error doesn't hide a
  backend test failure.
- **Cached** uv and npm installs keep runs quick.
- **No secrets needed** — tests mock the LLM client and the UI build bakes only a
  public base URL, so CI runs on a fresh clone with nothing configured.

The status badge in the top-level README reflects this workflow.

## CD — suggested 🧭

A pragmatic path from green CI to a running deployment. Not wired up here (it
needs a target environment and secrets), but this is the shape I'd use.

### 1. Build & publish images on a tag

```yaml
# .github/workflows/release.yml  (sketch)
on:
  push:
    tags: ['v*']
jobs:
  build-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write          # push to GitHub Container Registry
    strategy:
      matrix:
        service: [api, ui]
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: ./${{ matrix.service }}
          push: true
          tags: ghcr.io/${{ github.repository }}/${{ matrix.service }}:${{ github.ref_name }}
```

### 2. Promote, don't rebuild

The image built once on tag is the **same artifact** promoted through
environments. Deploy by pinning the immutable tag; never rebuild per environment.

```
PR ──► CI (test+build) ──► merge ──► tag vX.Y.Z ──► build+push images
                                                        │
                                   staging ◄── deploy ──┤
                                                        ▼
                                   prod   ◄── deploy (manual approval gate)
```

### 3. Deployment trigger options

- **GitOps** (recommended) — a manifests repo + Argo CD / Flux reconciles the
  cluster to the pinned image tag. Auditable, revertible by git.
- **Push-based** — a `deploy` workflow job calls the platform's CLI/API after
  approval. Simpler; fine for a single environment.

### 4. Gates worth adding as the project grows

- Lint + format check (`ruff`, `eslint`/`prettier`) as a third CI job.
- Coverage threshold on the API tests.
- A smoke test against the running container (`GET /ping`, one chat round-trip
  against a mock provider) before promotion.
- Dependency / image scanning (`pip-audit`, `npm audit`, Trivy on the image).

These are intentionally left out of the starter to keep it lean — add them when
the project earns the complexity.
