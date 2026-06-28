# LLM Usage

The model layer is **provider-agnostic**. There is one client, built on the
OpenAI SDK, pointed at any OpenAI-compatible endpoint. Switching providers is a
configuration change, never a code change.

## The client

`app/repositories/llm_repository.py`:

```python
class LlmRepository:
    @classmethod
    def chat(cls, messages: list[Message], model_name: str | None = None) -> str: ...
    @classmethod
    def list_available_models(cls) -> list[str]: ...
```

It reads three settings: `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `DEFAULT_MODEL`.

## Providers

| Provider | `OPENAI_BASE_URL` | Key |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | required |
| Ollama (local, offline) | `http://localhost:11434/v1` | not needed |
| vLLM / LM Studio / others | their `/v1` endpoint | per provider |

Going fully offline:

```bash
ollama pull llama3.2
ollama serve
```

```env
OPENAI_BASE_URL=http://localhost:11434/v1
DEFAULT_MODEL=llama3.2
```

That's the only change.

## Rules

- **Talk to models only through `LlmRepository`.** No `OpenAI(...)` anywhere else.
- **No vendor-specific SDKs.** If you need a feature only one provider has,
  discuss it in an ADR first — keeping the OpenAI-compatible contract is the
  whole value here. See
  [`../decisions/0001-provider-agnostic-llm-client.md`](../decisions/0001-provider-agnostic-llm-client.md).
- **Degrade, don't 500.** Listing models falls back to the default model if the
  provider is unreachable, rather than failing the request (see
  `ChatService.list_models`).
- **Log token usage** via `log_metric` (see [logging.md](logging.md)).

## Prompts

System prompts live in `app/prompts/`. Keep them in code (versioned, reviewable),
not in a database.
