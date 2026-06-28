# Testing

Tests should run anywhere, instantly, with no network and no API key.

## Backend

`pytest` against the FastAPI app via `TestClient`. The LLM client is **mocked**,
so tests never hit a provider.

```bash
cd api
uv run pytest
```

What's covered (`api/tests/`):

| Test | Asserts |
|---|---|
| `test_ping` | `/ping` is open and returns `{"status": "ok"}` |
| `test_chat` | init → send_message round-trip; session is created when missing; models list |
| `test_auth` | open when `API_ACCESS_KEY` unset; 403 when set and missing/wrong; 200 with the right key |

### Mocking the model

`conftest.py` provides a `mock_llm` fixture that monkeypatches `LlmRepository`:

```python
def test_chat_happy_path(client, mock_llm):
    session_id = client.post("/api/v1/chat/init").json()["session_id"]
    body = client.post("/api/v1/chat/send_message",
                       json={"user_query": "hi", "session_id": session_id}).json()
    assert body["answer"] == "This is a mocked assistant reply."
```

Rules:
- **Never call a real provider in tests.** Use the `mock_llm` fixture.
- **Toggle auth with env vars** (`monkeypatch.setenv("API_ACCESS_KEY", ...)`),
  since `verify_api_key` reads the key per request.
- Add a test when you add an endpoint or a branch worth protecting.

## Frontend

The type-checker is the first line of defense — `npm run build` runs `tsc` and
fails on any type error. Keep the build green; treat a red build as a failing
test.
