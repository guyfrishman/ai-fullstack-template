# Frontend

React 18 + TypeScript + Vite + Tailwind. Small, typed, and boring on purpose.

## Layout

```
ui/src/
├── App.tsx            # shell (header + sidebar) and routes
├── components/        # reusable presentational pieces (Sidebar, ...)
├── pages/             # one component per route (Chatbot, About)
├── lib/
│   ├── api.ts         # typed API calls — the only place fetch() shapes live
│   ├── apiConfig.ts   # base URL, headers, JSON GET/POST helpers, error parsing
│   └── site.ts        # presentation constants (name, repo URL, prompts)
└── styles/index.css   # Tailwind entry + base resets
```

## Rules

- **All API access goes through `lib/api.ts`.** Components never call `fetch`
  directly. `api.ts` exposes typed functions (`sendMessage`, `getModels`,
  `initChatSession`); `apiConfig.ts` owns the transport details.
- **Type the API contract.** Request/response shapes are explicit TypeScript
  types that mirror the backend's Pydantic models.
- **Config via `import.meta.env`.** `VITE_API_BASE_URL` (default
  `http://localhost:8000`) and the optional `VITE_API_KEY` are read in
  `apiConfig.ts`, declared in `vite-env.d.ts`. No hard-coded URLs in components.
- **Tailwind utility classes**, no separate CSS modules. Shared brand colors live
  in `tailwind.config.js` under the `brand` palette.
- **Presentational constants in `lib/site.ts`** (app name, repo link, suggested
  prompts) so copy and links stay in one place.
- **State stays local.** This app is small enough to use `useState`/`useEffect`;
  no global state library. Keep effects honest (cleanup with a `mounted` flag).
- **Handle loading and error states** for every async call — the Chatbot page is
  the reference (status indicator, "thinking" state, error banner).

## English, LTR

The UI is English, left-to-right. Keep it that way unless localization is added
deliberately (it would be a new concern, not an inline hack).

## Build

```bash
npm run dev      # dev server with HMR + /api proxy to :8000
npm run build    # tsc type-check, then vite production bundle
```

The build runs `tsc` first, so a type error fails the build. Keep it green.
