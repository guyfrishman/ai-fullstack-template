# ui — React frontend

**Path:** `ui/` · **Dev port:** 5173

## What it does

A single-page app with a working **Chatbot** page wired to the API, and an
**About** page that explains the architecture. English, left-to-right.

## Layout

```
src/
├── App.tsx            # shell (header + sidebar) and routes
├── components/        # Sidebar
├── pages/             # Chatbot, About
├── lib/
│   ├── api.ts         # typed API calls
│   ├── apiConfig.ts   # base URL, headers, fetch helpers
│   └── site.ts        # presentation constants
└── styles/index.css   # Tailwind entry
```

Conventions: [`../conventions/frontend.md`](../conventions/frontend.md).

## Run

```bash
cd ui
cp .env.example .env
npm install
npm run dev                            # http://localhost:5173
npm run build                          # tsc type-check + production bundle
```

## Config

| Variable | Meaning |
|---|---|
| `VITE_API_BASE_URL` | API base (default `http://localhost:8000`). Empty = use the Vite `/api` dev proxy |
| `VITE_API_KEY` | Optional `X-API-Key`, only if the API has `API_ACCESS_KEY` set |

## Quirks

- The Chatbot **calls `/chat/init` and `/models` on load**; a colored status dot
  shows whether the API is reachable.
- The conversation **resets on reload** — the browser doesn't persist the
  `session_id` in this version (see
  [`../decisions/0002-server-side-session-history.md`](../decisions/0002-server-side-session-history.md)).
- Production build is served by plain nginx (`ui/Dockerfile`, `ui/nginx.conf`) —
  no auth, no upstream proxy injection.
