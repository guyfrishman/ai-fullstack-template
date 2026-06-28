# 0003 — API-key auth is a no-op when unset (open locally)

**Status:** Accepted

## Context

The API needs an auth story, but a template that demands key setup before it will
run is annoying to evaluate. We want zero-friction local runs *and* a real lock
for deployment.

## Decision

`verify_api_key` guards `/api/v1/*` with an `X-API-Key` header, but:
- If `API_ACCESS_KEY` is **empty/unset**, auth is a **no-op** — all requests pass.
- If `API_ACCESS_KEY` is **set**, requests must send a matching header or get 403.

The key is read **per request** (not cached at import), so it can be toggled at
runtime and in tests.

`/ping` is always open and lives outside `/api/v1`.

## Consequences

**Good:**
- `git clone` → run → it works, no secrets required.
- Flipping one env var turns on a real gate, no code change.
- Tests toggle auth simply with `monkeypatch.setenv`.

**Bad:**
- "Open by default" must be communicated clearly so nobody deploys it unset. It's
  documented in the README, `configuration.md`, and the `/settings` response
  (`auth_enabled`). The mitigation is documentation, accepted deliberately.

## Alternatives considered

- **Always require a key:** safer default, worse first-run experience for a
  template. Rejected in favor of explicit documentation.
- **OAuth / JWT / provider SSO:** the right move for a real product, overkill for
  a template and a heavy dependency. Out of scope; add it per project.
