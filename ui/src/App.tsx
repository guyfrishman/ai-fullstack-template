import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Github } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Chatbot from './pages/Chatbot'
import About from './pages/About'
import { SITE } from './lib/site'

function App() {
  return (
    <Router>
      <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              {SITE.authorInitials}
            </span>
            <div className="flex flex-col leading-tight">
              <h1 className="text-base font-semibold tracking-tight text-slate-900">
                {SITE.name} <span className="font-normal text-slate-400">by {SITE.author}</span>
              </h1>
              <span className="hidden text-xs text-slate-400 sm:inline">{SITE.tagline}</span>
            </div>
          </div>
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <Github size={16} />
            <span className="hidden sm:inline">View source</span>
          </a>
        </header>

        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="min-h-0 flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/chatbot" replace />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
