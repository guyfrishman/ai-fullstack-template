import {
  Boxes,
  Database,
  FileCode2,
  Github,
  KeyRound,
  Layers,
  ScrollText,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { SITE } from '../lib/site'

type Pattern = {
  icon: typeof Layers
  title: string
  body: string
}

// The engineering ideas this template is meant to showcase. Each maps to a
// real file in the backend so reviewers can read the implementation.
const PATTERNS: Pattern[] = [
  {
    icon: Layers,
    title: 'Router composition',
    body: 'Each feature is a bare FastAPI APIRouter; a single api.py composes them under /api/v1 with prefixes and tags. Handlers stay short and verb-noun.',
  },
  {
    icon: Database,
    title: 'Repository pattern',
    body: 'Storage sits behind an abstract SessionRepository. An in-memory impl ships; a Redis/Postgres one drops in with zero changes to the service layer.',
  },
  {
    icon: Boxes,
    title: 'Provider-agnostic LLM',
    body: 'One OpenAI-compatible client. Point it at OpenAI, a local Ollama, or vLLM — switching providers is an .env change, not a code change.',
  },
  {
    icon: ScrollText,
    title: 'Structured logging',
    body: 'A @log_activity decorator emits JSON start/finish/error lines tagged with request-scoped session and trace ids via ContextVars.',
  },
  {
    icon: KeyRound,
    title: 'Config as settings',
    body: 'A single typed pydantic-settings object, driven entirely by environment variables. No scattered os.getenv calls.',
  },
  {
    icon: ShieldCheck,
    title: 'Pragmatic security',
    body: 'An X-API-Key dependency guards /api/v1. It is a deliberate no-op when no key is set, so local dev stays frictionless; set a key to lock it down.',
  },
]

const STACK = [
  { label: 'Backend', value: 'FastAPI · Pydantic · uv · OpenAI SDK' },
  { label: 'Frontend', value: 'React 18 · TypeScript · Vite · Tailwind' },
  { label: 'Tooling', value: 'Docker Compose · Pytest' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Intro */}
      <section className="mb-8">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Full-stack AI template
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Built to show how I structure code — not just that it runs
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
          This is a small, end-to-end AI app: a FastAPI backend with a provider-agnostic LLM
          client and a typed React frontend. It is intentionally compact, but every layer follows
          the same patterns I would reach for in a production service — clear seams, swappable
          dependencies, and observability baked in from the start.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <Github size={16} />
            View the source
          </a>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            <FileCode2 size={16} />
            Open the API docs
          </a>
        </div>
      </section>

      {/* Patterns grid */}
      <section className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          What it demonstrates
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {PATTERNS.map((pattern) => {
            const Icon = pattern.icon
            return (
              <div
                key={pattern.title}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon size={17} />
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">{pattern.title}</h4>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{pattern.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stack */}
      <section className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Tech stack
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {STACK.map((row, index) => (
            <div
              key={row.label}
              className={`flex items-center gap-4 px-4 py-3 ${
                index > 0 ? 'border-t border-slate-100' : ''
              }`}
            >
              <span className="w-24 shrink-0 text-sm font-medium text-slate-500">{row.label}</span>
              <span className="text-sm text-slate-800">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Try it */}
      <section className="rounded-xl border border-brand-100 bg-brand-50/50 p-5">
        <div className="mb-2 flex items-center gap-2 text-brand-700">
          <Terminal size={17} />
          <h3 className="text-sm font-semibold">Try it yourself</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Head to the <span className="font-medium text-slate-800">Chatbot</span> page to see the
          full request flow in action. The backend runs fully offline against a local Ollama model,
          or against any OpenAI-compatible provider — no code changes, just configuration.
        </p>
      </section>
    </div>
  )
}
