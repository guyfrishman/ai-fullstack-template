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
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">{SITE.name}</h1>
            <span className="hidden text-sm text-slate-400 sm:inline">{SITE.tagline}</span>
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
