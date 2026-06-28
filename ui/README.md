# UI — React + Vite + TypeScript + Tailwind

A minimal single-page app with one Chatbot page wired to the API.

## Stack

- React 18 + TypeScript
- Vite (dev server + build)
- Tailwind CSS
- react-router-dom, react-markdown, lucide-react

## Configuration

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

- `VITE_API_BASE_URL` — where the API lives. Default `http://localhost:8000`.
  Set it to an empty string to use relative `/api` paths via the Vite dev proxy
  (configured in `vite.config.ts` to forward to `http://localhost:8000`).
- `VITE_API_KEY` *(optional)* — only needed if the API has `API_ACCESS_KEY` set.
  The API is open by default.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:5173. With the API running, the Chatbot page calls
`/chat/init` on load and `/chat/send_message` as you chat.

## Build

```bash
npm run build      # type-check + bundle to dist/
npm run preview    # serve the built bundle locally
```

## Docker

```bash
docker build -t ai-template-ui --build-arg VITE_API_BASE_URL=http://localhost:8000 .
docker run --rm -p 5173:80 ai-template-ui
```
