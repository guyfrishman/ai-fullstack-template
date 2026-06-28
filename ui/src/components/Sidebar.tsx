import { NavLink } from 'react-router-dom'
import { Info, MessageCircle } from 'lucide-react'
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

      <div className="px-2 text-xs leading-relaxed text-slate-400">
        Built by <span className="font-medium text-slate-500">{SITE.author}</span>
        <br />
        Open source · MIT
      </div>
    </aside>
  )
}
