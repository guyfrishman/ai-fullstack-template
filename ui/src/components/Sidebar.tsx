import { NavLink } from 'react-router-dom'
import { Github, Info, Mail, MessageCircle } from 'lucide-react'
import { SITE } from '../lib/site'

const navItems = [
  {
    label: 'Chatbot',
    description: 'A live demo wired to the API',
    icon: MessageCircle,
    path: '/chatbot',
  },
  {
    label: 'About',
    description: 'How this template is built',
    icon: Info,
    path: '/about',
  },
]

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white px-3 py-5">
      <nav className="flex flex-col gap-2" aria-label="Pages">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                  isActive
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <div>
                <div className="text-sm font-medium leading-tight">{item.label}</div>
                <div className="mt-0.5 text-xs leading-tight text-slate-400">{item.description}</div>
              </div>
            </NavLink>
          )
        })}
      </nav>

      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {SITE.authorInitials}
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-800">{SITE.author}</div>
            <div className="text-xs text-slate-400">{SITE.authorRole}</div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
          >
            <Github size={13} /> GitHub
          </a>
          <a
            href={`mailto:${SITE.email}`}
            aria-label="Email"
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
          >
            <Mail size={13} /> Email
          </a>
        </div>
      </div>
    </aside>
  )
}
