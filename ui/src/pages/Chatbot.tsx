import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { AlertCircle, Bot, Loader2, Send, Sparkles, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ChatRole,
  ModelInfo,
  getModels,
  initChatSession,
  sendMessage,
} from '../lib/api'
import { SUGGESTED_PROMPTS } from '../lib/site'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

type ApiStatus = 'checking' | 'online' | 'offline'

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi! I am the AI Template assistant. Ask me anything to see the full request flow in action.',
}

const MARKDOWN_CLASSES =
  '[&_p]:text-sm [&_p]:leading-6 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:text-sm [&_li]:leading-6 [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-slate-100 [&_table]:mt-2 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1'

const STATUS_META: Record<ApiStatus, { dot: string; label: string }> = {
  checking: { dot: 'bg-amber-400', label: 'Connecting to API…' },
  online: { dot: 'bg-emerald-500', label: 'Connected to API' },
  offline: { dot: 'bg-red-400', label: 'API offline — start the backend on :8000' },
}

export default function Chatbot() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [composer, setComposer] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending, error])

  useEffect(() => {
    let mounted = true
    // Two calls on load mirror the API design: create a session, then discover
    // which models the provider serves. Either failing flags the API offline.
    Promise.all([initChatSession(), getModels()])
      .then(([session, modelList]) => {
        if (!mounted) return
        setSessionId(session.session_id)
        setModels(modelList.models)
        setSelectedModel(modelList.default_model)
        setApiStatus('online')
      })
      .catch(() => mounted && setApiStatus('offline'))
    return () => {
      mounted = false
    }
  }, [])

  const send = async (text: string) => {
    const query = text.trim()
    if (!query || isSending) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: query }
    setMessages((prev) => [...prev, userMessage])
    setComposer('')
    setIsSending(true)
    setError(null)

    try {
      const response = await sendMessage({
        user_query: query,
        session_id: sessionId || undefined,
        model_name: selectedModel || undefined,
      })
      setSessionId(response.session_id)
      setApiStatus('online')
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: response.answer },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void send(composer)
    }
  }

  const isEmptyConversation = messages.length === 1 && !isSending
  const status = STATUS_META[apiStatus]

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col p-4 md:p-6">
      {/* Header: title, live status, model picker */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Chatbot</h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
            {apiStatus === 'online' && selectedModel && (
              <span className="text-slate-400">· {selectedModel}</span>
            )}
          </div>
        </div>
        {models.length > 0 && (
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Model
            <select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-brand-500"
            >
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* What's happening under the hood — orient the visitor */}
      <div className="mb-3 rounded-lg border border-brand-100 bg-brand-50/60 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">
        Each message calls <code className="rounded bg-white px-1 py-0.5 text-brand-700">POST /api/v1/chat/send_message</code>.
        The server stores the conversation under a session id and replays the full history to the
        model, so the browser only sends the latest turn. Open your network tab to watch it.
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-200 bg-white">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex max-w-[80%] gap-2 rounded-2xl px-3.5 py-2.5 ${
                    isUser
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isUser ? <User size={15} /> : <Bot size={15} />}
                  </span>
                  {isUser ? (
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  ) : (
                    <div className={MARKDOWN_CLASSES}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* First-run helper: clickable starter prompts */}
          {isEmptyConversation && (
            <div className="pt-2">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Sparkles size={14} />
                Try one of these
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void send(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message, then press Enter to send..."
              rows={1}
              className="min-h-[44px] flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => void send(composer)}
              disabled={!composer.trim() || isSending}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="mt-1.5 px-1 text-[11px] text-slate-400">
            Shift + Enter for a new line. The conversation resets when you reload.
          </p>
        </div>
      </div>
    </div>
  )
}
