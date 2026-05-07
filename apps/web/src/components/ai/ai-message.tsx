'use client'

import { Brain } from 'lucide-react'
import type { AIMessage } from '@/store/ai'

// ─── Inline markdown renderer ─────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-white/90">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="px-1 py-0.5 rounded bg-white/[0.08] text-primary/80 font-mono text-[10px]">{part.slice(1, -1)}</code>
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic text-white/80">{part.slice(1, -1)}</em>
    return part
  })
}

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      nodes.push(
        <pre key={`cb-${i}`} className="my-2 p-3 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono text-white/65 overflow-x-auto leading-relaxed">
          {codeLines.join('\n')}
        </pre>
      )
      i++; continue
    }

    // Headings
    if (line.startsWith('### ')) {
      nodes.push(<p key={i} className="text-[11px] font-bold text-white/90 mt-3 mb-1 uppercase tracking-wider">{renderInline(line.slice(4))}</p>)
      i++; continue
    }
    if (line.startsWith('## ') || line.startsWith('# ')) {
      const depth = line.startsWith('# ') ? 2 : 3
      nodes.push(<p key={i} className={`font-bold text-white/90 mt-3 mb-1 ${depth === 2 ? 'text-sm' : 'text-xs'}`}>{renderInline(line.replace(/^#{1,3} /, ''))}</p>)
      i++; continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={i} className="my-2 border-white/[0.08]" />)
      i++; continue
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && /^[-•*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-•*] /, ''))
        i++
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-1.5 space-y-1 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-xs text-white/65">
              <span className="text-primary/50 shrink-0 mt-[3px] text-[8px]">▸</span>
              <span className="leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      let num = 1
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++; num++
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-1.5 space-y-1 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-xs text-white/65">
              <span className="text-primary/50 shrink-0 font-mono text-[10px] mt-[2px] min-w-[16px]">{j + 1}.</span>
              <span className="leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      )
      void num
      continue
    }

    // Empty line
    if (line.trim() === '') {
      nodes.push(<div key={i} className="h-1" />)
      i++; continue
    }

    // Paragraph
    nodes.push(
      <p key={i} className="text-xs text-white/68 leading-relaxed">{renderInline(line)}</p>
    )
    i++
  }

  return nodes
}

// ─── Component ────────────────────────────────────────────────

interface Props {
  message:     AIMessage
  isStreaming?: boolean
}

export function AIMessageItem({ message, isStreaming }: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-primary/20 border border-primary/25">
          <p className="text-xs text-white/80 leading-relaxed">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
        <Brain className="w-3 h-3 text-primary" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        {message.content ? (
          <div className="space-y-0.5">{renderMarkdown(message.content)}</div>
        ) : isStreaming ? (
          <div className="flex items-center gap-1 py-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
