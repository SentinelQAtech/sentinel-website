'use client'

import { cn } from '@/lib/utils'

// ─── Pre-process legacy text (no line breaks) ─────────────────
// For text captured before the htmlToText fix, we insert breaks
// at detectable boundaries so it's still readable.

function preProcess(raw: string): string {
  return raw
    // Before requirement IDs: FR-001, UC-01, REQ-1, etc.
    .replace(/([a-z.,)])\s*((?:FR|UC|REQ|AC|BR|NFR)-\d+)/g, '$1\n$2')
    // Before numbered items glued to prior text: "...text1. The next"
    .replace(/([a-z.)])\s*(\d{1,2}\.\s+[A-Z])/g, '$1\n$2')
    // → used as flow separator → add newline before
    .replace(/\s*→\s*/g, '\n→ ')
    // Before all-caps section headers that follow lowercase
    .replace(/([a-z.,])\s+([A-Z][A-Za-z ]{3,}:)/g, '$1\n$2')
    // Clean up triple+ newlines
    .replace(/\n{3,}/g, '\n\n')
}

// ─── Detect URL helper ────────────────────────────────────────

const URL_RE = /https?:\/\/[^\s)>]+/g

function segmentURLs(text: string): Array<{ type: 'text' | 'url'; value: string }> {
  const parts: Array<{ type: 'text' | 'url'; value: string }> = []
  let last = 0
  let match: RegExpExecArray | null
  URL_RE.lastIndex = 0
  while ((match = URL_RE.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', value: text.slice(last, match.index) })
    parts.push({ type: 'url', value: match[0] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

function InlineContent({ text }: { text: string }) {
  const segments = segmentURLs(text)
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'url' ? (
          <a
            key={i}
            href={seg.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary underline underline-offset-2 break-all transition-colors"
          >
            {seg.value}
          </a>
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </>
  )
}

// ─── Line renderer ────────────────────────────────────────────

function renderLine(line: string, idx: number) {
  const trimmed = line.trim()
  if (!trimmed) return <div key={idx} className="h-2" />

  // Numbered list: "1. text" or "N. text"
  const numberedMatch = trimmed.match(/^(\d{1,2})\.\s+(.+)/)
  if (numberedMatch) {
    return (
      <div key={idx} className="flex gap-2.5 items-baseline">
        <span className="shrink-0 min-w-[1.25rem] text-right font-mono text-[11px] font-semibold text-white/35">
          {numberedMatch[1]}.
        </span>
        <span className="leading-relaxed"><InlineContent text={numberedMatch[2]} /></span>
      </div>
    )
  }

  // Bullet: "- text" or "• text"
  const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/)
  if (bulletMatch) {
    return (
      <div key={idx} className="flex gap-2.5 items-baseline">
        <span className="shrink-0 text-primary/50 text-[10px] mt-[3px]">●</span>
        <span className="leading-relaxed"><InlineContent text={bulletMatch[1]} /></span>
      </div>
    )
  }

  // Arrow flow: "→ text"
  if (trimmed.startsWith('→')) {
    return (
      <div key={idx} className="flex gap-2 items-baseline pl-3 text-white/65">
        <span className="shrink-0 text-primary/50">→</span>
        <span className="leading-relaxed"><InlineContent text={trimmed.slice(1).trim()} /></span>
      </div>
    )
  }

  // Requirement ID: "FR-001 text", "UC-01 text"
  const reqMatch = trimmed.match(/^([A-Z]{2,4}-\d+)\s*(.*)/)
  if (reqMatch) {
    return (
      <div key={idx} className="flex gap-2.5 items-baseline">
        <span className="shrink-0 font-mono text-[10px] font-bold text-primary/60 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
          {reqMatch[1]}
        </span>
        <span className="leading-relaxed text-white/65"><InlineContent text={reqMatch[2]} /></span>
      </div>
    )
  }

  // Section header: line ends with ":" or is short + title-case (≤60 chars, no period)
  const isHeader = /^[A-Z]/.test(trimmed) && trimmed.length <= 60 &&
    (trimmed.endsWith(':') || (!trimmed.includes('.') && /^[A-Z][A-Za-z\s/()-]+$/.test(trimmed)))
  if (isHeader) {
    return (
      <p key={idx} className="mt-3 mb-0.5 text-[11px] font-bold uppercase tracking-wider text-white/40 first:mt-0">
        {trimmed.replace(/:$/, '')}
      </p>
    )
  }

  // Standalone URL line
  if (/^https?:\/\//.test(trimmed)) {
    return (
      <a
        key={idx}
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className="block break-all text-xs text-primary/70 hover:text-primary underline underline-offset-2 transition-colors"
      >
        {trimmed}
      </a>
    )
  }

  // Default paragraph
  return (
    <p key={idx} className="leading-relaxed">
      <InlineContent text={trimmed} />
    </p>
  )
}

// ─── Main component ───────────────────────────────────────────

interface FormattedTextProps {
  text: string
  className?: string
  emptyMessage?: string
}

export function FormattedText({ text, className, emptyMessage }: FormattedTextProps) {
  if (!text?.trim()) {
    if (emptyMessage) {
      return <p className="text-sm text-white/25 italic">{emptyMessage}</p>
    }
    return null
  }

  // Pre-process to insert missing line breaks in legacy text
  const processed = preProcess(text)
  const lines = processed.split('\n')

  return (
    <div className={cn('space-y-1.5 text-sm text-white/70', className)}>
      {lines.map((line, idx) => renderLine(line, idx))}
    </div>
  )
}
