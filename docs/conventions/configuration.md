# Configuration

All configuration is environment-driven through a single typed settings object.
No scattered `os.getenv` calls across the codebase.

## `app/config.py`

```python
class Settings(BaseSettings):
    log_level: str = "INFO"
    api_access_key: str = ""
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    default_model: str = "gpt-4o-mini"
    ui_base_url: str = "http://localhost:5173"
    project_name: str = "AI Fullstack Template API"
    version: str = "0.1.0"

settings = Settings()
```

Rules:
- One `Settings` (`pydantic_settings.BaseSettings`). Import `settings` where you
  need config.
- Every setting has a **safe default** so the app boots with an empty `.env`.
- `.env.example` is the documented contract. Copy it to `.env` to run.

## The env vars

| Variable | Meaning |
|---|---|
| `LOG_LEVEL` | `INFO` / `DEBUG` |
| `API_ACCESS_KEY` | If set, `/api/v1/*` requires `X-API-Key`. **Empty = open** |
| `OPENAI_API_KEY` | Provider key (not needed for local Ollama) |
| `OPENAI_BASE_URL` | OpenAI-compatible endpoint |
| `DEFAULT_MODEL` | Model used when the client requests none |
| `UI_BASE_URL` | Extra CORS origin to allow |

## Secrets

- Secrets come from the environment only. Never commit a real `.env` — only
  `.env.example` is tracked (see [`.gitignore`](../../.gitignore)).
- Don't pass secrets as function arguments (the logger truncates but doesn't
  redact — see [logging.md](logging.md)).
- The `/api/v1/settings` endpoint returns **non-secret** config only. Never add a
  key or token to its response model.

## Auth is optional locally

`API_ACCESS_KEY` empty means `verify_api_key` is a no-op and the API is open —
frictionless local dev. Set the key to lock `/api/v1/*` down. The rationale is in
[`../decisions/0003-optional-api-key-auth.md`](../decisions/0003-optional-api-key-auth.md).
