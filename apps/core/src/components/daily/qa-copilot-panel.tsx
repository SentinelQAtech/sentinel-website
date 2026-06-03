'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Bot, Send, Copy, Check, RotateCcw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QAItem } from '@/store/qa-importer'

// ─── Types ────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── Helpers ──────────────────────────────────────────────────

function buildFirstMessage(item: QAItem): string {
  const comments = item.comments?.slice(0, 5).map((comment, index) => `Comentario ${index + 1}: ${comment.body}`).join('\n') ?? ''
  const prs = item.pullRequests?.map(link => `${link.text || 'PR'}: ${link.url}`).join('\n') ?? ''
  const links = item.externalLinks?.slice(0, 8).map(link => `${link.text || 'Link'}: ${link.url}`).join('\n') ?? ''

  const lines = [
    `Analisar card ${item.issueKey ? item.issueKey : 'QA'}: ${item.title}`,
    '',
    `Prioridade: ${item.priority}`,
    item.status  && `Status: ${item.status}`,
    item.sprint  && `Sprint: ${item.sprint}`,
    item.notes   && `Notas: ${item.notes}`,
    item.description && `Descricao Jira:\n${item.description}`,
    comments && `Comentarios Jira:\n${comments}`,
    prs && `PRs / versao:\n${prs}`,
    links && `Links externos:\n${links}`,
    item.link    && `Link: ${item.link}`,
  ]
  return lines.filter(Boolean).join('\n')
}

// ─── Minimal markdown renderer ─────────────────────────────────

function renderInline(str: string): React.ReactNode[] {
  const parts = str.split(/\*\*(.*?)\*\*/)
  return parts.map((p, j) =>
    j % 2 === 1
      ? <strong key={j} className="text-white/90 font-semibold">{p}</strong>
      : p
  )
}

function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null

  return (
    <div className="space-y-1">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />

        // Headers
        if (/^#{2,3} /.test(line)) {
          const content = line.replace(/^#{2,3} /, '')
          return <p key={i} className="font-semibold text-white/85 mt-2">{renderInline(content)}</p>
        }

        // Checkboxes (checked)
        if (/^- \[[xX]\] /.test(line)) {
          return (
            <p key={i} className="flex gap-2 text-emerald-400/80">
              <span className="shrink-0">☑</span>
              <span>{renderInline(line.slice(6))}</span>
            </p>
          )
        }

        // Checkboxes (unchecked)
        if (line.startsWith('- [ ] ')) {
          return (
            <p key={i} className="flex gap-2 text-white/55">
              <span className="shrink-0">☐</span>
              <span>{renderInline(line.slice(6))}</span>
            </p>
          )
        }

        // Indented bullets
        if (/^ {2,}[-•*] /.test(line)) {
          const content = line.replace(/^ {2,}[-•*] /, '')
          return (
            <p key={i} className="flex gap-2 pl-4 text-white/50">
              <span className="shrink-0 mt-[3px] text-[7px]">◦</span>
              <span>{renderInline(content)}</span>
            </p>
          )
        }

        // Bullets
        if (/^[-•*] /.test(line)) {
          const content = line.replace(/^[-•*] /, '')
          return (
            <p key={i} className="flex gap-2 text-white/65">
              <span className="shrink-0 mt-[3px] text-primary text-[7px]">●</span>
              <span>{renderInline(content)}</span>
            </p>
          )
        }

        return <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────

export function QACopilotPanel({ item }: { item: QAItem }) {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [streaming, setStreaming] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const prevItemId  = useRef<string | null>(null)
  const abortRef    = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const sendMessage = useCallback(async (userText: string, history: Message[]) => {
    if (abortRef.current) abortRef.current.abort()
    const abort = new AbortController()
    abortRef.current = abort

    const next: Message[] = [...history, { role: 'user', content: userText }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setStreaming(true)

    try {
      const res = await fetch('/api/qa-copilot', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
        signal:  abort.signal,
      })

      if (!res.ok || !res.body) {
        setMessages([...next, { role: 'assistant', content: '❌ Erro ao conectar com o QA Copilot. Verifique a API key.' }])
        return
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      let buf  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const d = line.slice(6).trim()
          if (!d || d === '[DONE]') continue
          try {
            const parsed = JSON.parse(d)
            if (parsed.text) {
              text += parsed.text
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = { role: 'assistant', content: text }
                return copy
              })
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: '❌ Conexão interrompida. Tente novamente.' },
        ])
      }
    } finally {
      setStreaming(false)
      scrollToBottom()
    }
  }, [])

  // Auto-analyze when item changes
  useEffect(() => {
    if (item.id === prevItemId.current) return
    prevItemId.current = item.id
    setMessages([])
    sendMessage(buildFirstMessage(item), [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || streaming) return
    const text = input.trim()
    setInput('')
    sendMessage(text, messages.filter(m => m.content !== ''))
  }

  const copyMessage = async (content: string, idx: number) => {
    await navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const reset = () => {
    if (abortRef.current) abortRef.current.abort()
    setMessages([])
    sendMessage(buildFirstMessage(item), [])
  }

  return (
    <div className="rounded-xl border border-primary/15 bg-black/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-white/70">QA Copilot</span>
          <span className="text-[10px] text-white/25">
            {item.issueKey || 'QA'}
          </span>
          {streaming && <Loader2 className="h-3 w-3 text-primary animate-spin ml-1" />}
        </div>
        <button
          onClick={reset}
          title="Reiniciar análise"
          className="text-white/25 hover:text-white/60 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto p-3 space-y-3 max-h-[380px] min-h-[120px]">
        {messages.length === 0 && !streaming && (
          <div className="flex items-center justify-center py-8 text-xs text-white/25">
            Analisando card...
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              'group flex flex-col gap-1',
              msg.role === 'user' && 'items-end',
            )}
          >
            <div
              className={cn(
                'max-w-[88%] rounded-xl px-3 py-2.5 text-xs leading-relaxed',
                msg.role === 'user'
                  ? 'bg-primary/15 text-white/80 border border-primary/20'
                  : 'bg-white/[0.03] text-white/70 border border-white/[0.07]',
              )}
            >
              {msg.role === 'assistant' ? (
                <SimpleMarkdown
                  text={
                    msg.content ||
                    (streaming && idx === messages.length - 1 ? '▌' : '')
                  }
                />
              ) : (
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              )}
            </div>

            {msg.role === 'assistant' && msg.content && (
              <button
                onClick={() => copyMessage(msg.content, idx)}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-all"
              >
                {copiedIdx === idx
                  ? <Check className="h-3 w-3" />
                  : <Copy className="h-3 w-3" />}
                {copiedIdx === idx ? 'Copiado' : 'Copiar'}
              </button>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 px-3 pb-3 pt-2 border-t border-white/[0.06] shrink-0"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Testei o fluxo X, comportamento foi Y..."
          disabled={streaming}
          className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-white/80 placeholder:text-white/25 focus:border-primary/30 focus:outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  )
}
