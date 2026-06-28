# Work Protocol

How any non-trivial change gets made here — by humans and coding agents alike.

## The three rules

1. **Plan first.** For anything touching more than one file, write a short
   step-by-step plan before editing. Each step states its deliverable (file,
   function, behavior) and how you'll verify it.
2. **One step at a time.** A step is finished only when it actually works —
   "it compiles" is not "it works." Run it, show the output, then move on.
3. **Stick to the plan.** If you discover something mid-way that demands a
   different approach, stop and re-plan rather than silently improvising.

This is slower on tiny tasks and much faster on real ones. It's the antidote to
ambitious sessions that produce a dozen files, none of which run.

## What a good step looks like

> **Step 2** — Add `GET /api/v1/settings`. New `routers/settings.py` returning a
> `SettingsResponse` with non-secret config; mount it in `routers/api.py`.
> **Verify:** `curl localhost:8000/api/v1/settings` returns the project name and
> `auth_enabled`, and `uv run pytest` stays green.

Bad: "Add a settings endpoint." (No deliverable, no verification.)

## Suggesting solutions with trade-offs

When the design space has several valid choices, present the options, name the
trade-offs honestly (speed, complexity, risk), recommend one with reasoning, and
let the decision-maker choose. Don't pick silently — that's the same bug as
skipping the plan. If a decision is architectural, record it in
[`../decisions/`](../decisions/).

## Pushback

Honest pushback beats agreement. If a request is technically wrong, say so with
reasons and propose the right thing — then let the decision-maker decide. This
applies in both directions: humans push back on agent suggestions, agents push
back on human ones.

## Definition of done

A change is done when **all** hold (see also [`../AGENTS.md`](../AGENTS.md)):

- It follows the conventions, or an ADR justifies the deviation.
- Tests pass (`uv run pytest`) and the UI builds (`npm run build`).
- The thing it changes runs end-to-end and the result is inspectable.
- Docs are updated if behavior or a convention changed.

If any of these is missing, it's not done. Don't move on.
