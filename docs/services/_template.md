# <service-name> — <one-line description>

**Path:** `<dir>/` · **Package/Port:** `<pkg>` · `<port>` · **Status:** <✅ implemented | 🧭 planned>

## What it does

<Two or three sentences: the job this service owns and why it's a separate unit.>

## Endpoints / interface

<Table of routes, queue topics, or CLI commands — whatever this unit exposes.>

| Method | Path | Auth | Description |
|---|---|---|---|
| ... | ... | ... | ... |

## Layout

```
<dir>/
├── ...
```

Follows the repo conventions — [routers](../conventions/routers.md),
[repositories](../conventions/repositories.md), [logging](../conventions/logging.md),
[config](../conventions/configuration.md).

## Run

```bash
# how to run it locally
```

## Dependencies

<What it talks to: the API, a datastore, a queue, the model provider.>

## Quirks

<Anything non-obvious a maintainer must know. Link the ADR if a design choice
needs justifying.>
