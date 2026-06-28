# 0001 — Provider-agnostic, OpenAI-compatible LLM client

**Status:** Accepted

## Context

The app needs to call a chat model. The options were: a vendor SDK (OpenAI,
Anthropic, Google), a multi-provider abstraction library, or the OpenAI SDK
pointed at any OpenAI-compatible endpoint.

A template should be easy to adopt, easy to run offline, and not lock its users
into one vendor or one cloud.

## Decision

Use the **OpenAI SDK against a configurable `OPENAI_BASE_URL`**, wrapped in a
single `LlmRepository`. The provider is chosen entirely by environment
variables (`OPENAI_API_KEY`, `OPENAI_BASE_URL`, `DEFAULT_MODEL`).

The OpenAI chat-completions protocol is the de facto standard — OpenAI, Ollama,
vLLM, LM Studio, and many hosted gateways all speak it. Targeting that protocol
gets us every one of them for free.

## Consequences

**Good:**
- Switch providers with an `.env` change, no code change.
- Runs fully offline against a local Ollama model — great for demos and CI.
- One small, well-understood dependency.

**Bad:**
- Provider-specific features outside the OpenAI protocol aren't exposed. If one
  is ever needed, it must be added behind the repository interface and justified
  in a new ADR — not by reaching for a vendor SDK in the service layer.

## Alternatives considered

- **A multi-provider abstraction library:** more surface area and another
  dependency to track, for capability we get from the protocol itself. Rejected.
- **A single vendor SDK:** simplest to start, but couples the template to one
  vendor and blocks offline use. Rejected.
