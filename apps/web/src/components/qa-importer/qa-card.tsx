'use client'

import { ExternalLink, Send, CheckCircle, AlertCircle, Trash2, Clock, Puzzle, Table2, PenLine, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type QAItem, QA_CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/store/qa-importer'

interface Props {
  item: QAItem
  selected: boolean
  onToggleSelect: (id: string) => void
  onSendToDaily: (item: QAItem) => void
  onMarkDone: (id: string) => void
  onMarkBlocked: (id: string) => void
  onRemove: (id: string) => void
  onOpen?: (item: QAItem) => void
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function QACard({ item, selected, onToggleSelect, onSendToDaily, onMarkDone, onMarkBlocked, onRemove, onOpen }: Props) {
  const cat = QA_CATEGORY_CONFIG[item.qaCategory]
  const prio = PRIORITY_CONFIG[item.priority]
  const isDone = item.qaCategory === 'Done'
  const isBlocked = item.qaCategory === 'Blocked'

  const SOURCE_ICON = {
    extension: { icon: <Puzzle className="w-3 h-3" />, label: 'Extensao', color: 'text-violet-400', bg: 'bg-violet-500/10' },
    csv: { icon: <Table2 className="w-3 h-3" />, label: 'CSV', color: 'text-sky-400', bg: 'bg-sky-500/10' },
    manual: { icon: <PenLine className="w-3 h-3" />, label: 'Manual', color: 'text-white/30', bg: 'bg-white/[0.05]' },
  }
  const src = SOURCE_ICON[item.source] ?? SOURCE_ICON.manual

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200',
        'bg-white/[0.02] hover:bg-white/[0.04]',
        selected
          ? 'border-primary/40 shadow-[0_0_0_1px_rgba(99,102,241,0.2)]'
          : 'border-white/[0.07] hover:border-white/[0.12]',
        isDone && 'opacity-55',
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleSelect(item.id)}
          className={cn(
            'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150',
            selected ? 'bg-primary border-primary text-white' : 'border-white/20 text-transparent hover:border-primary/50'
          )}
          aria-label="Selecionar card"
        >
          <span className="text-[9px] leading-none">✓</span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {item.issueKey && (
                <span className="font-mono text-[11px] font-bold text-white/50 bg-white/[0.06] px-1.5 py-0.5 rounded">
                  {item.issueKey}
                </span>
              )}
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: cat.color + '22', color: cat.color }}
              >
                {item.qaCategory}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: prio.color + '20', color: prio.color }}
              >
                {item.priority}
              </span>
              <span
                title={`Importado via ${src.label}`}
                className={cn('flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full', src.color, src.bg)}
              >
                {src.icon}
                {src.label}
              </span>
              {item.sentToDaily && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                  Daily
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {onOpen && (
                <button
                  onClick={() => onOpen(item)}
                  title="Ver detalhes"
                  className="text-white/25 hover:text-primary transition-colors duration-150"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-white/25 hover:text-primary transition-colors duration-150"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className={cn(
          'text-left text-sm font-medium text-white/85 leading-snug line-clamp-3 hover:text-white transition-colors',
          isDone && 'line-through text-white/40',
        )}
      >
        {item.title}
      </button>

      <div className="flex items-center gap-3 flex-wrap text-[11px] text-white/35">
        {item.client && <span className="font-medium text-white/55">{item.client}</span>}
        {item.sprint && <span>{item.sprint}</span>}
        {item.assignee && <span>@{item.assignee}</span>}
        {item.type && <span className="text-primary/60">{item.type}</span>}
      </div>

      {item.notes && (
        <p className="text-xs text-white/30 leading-relaxed line-clamp-2">{item.notes}</p>
      )}

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.05]">
        <div className="flex items-center gap-1 text-[10px] text-white/20">
          <Clock className="w-3 h-3" />
          {relTime(item.importedAt)}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {!item.sentToDaily && (
            <button
              onClick={() => onSendToDaily(item)}
              title="Send to Daily"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-primary/70 hover:text-primary hover:bg-primary/10 transition-all duration-150"
            >
              <Send className="w-3 h-3" />
              Daily
            </button>
          )}
          {!isDone && (
            <button
              onClick={() => onMarkDone(item.id)}
              title="Mark as Done"
              className="p-1.5 rounded-lg text-white/25 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-150"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {!isBlocked && !isDone && (
            <button
              onClick={() => onMarkBlocked(item.id)}
              title="Mark as Blocked"
              className="p-1.5 rounded-lg text-white/25 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-150"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onRemove(item.id)}
            title="Remove"
            className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
