'use client'

import { ExternalLink, Send, CheckCircle, AlertCircle, Trash2, Clock, Puzzle, Table2, PenLine, Maximize2, FileText, MessageSquare, GitPullRequest, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type QAItem, QA_CATEGORY_CONFIG, PRIORITY_CONFIG, getLocalISODate } from '@/store/qa-importer'

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
  const commentsCount = item.comments?.length ?? 0
  const prsCount = item.pullRequests?.length ?? 0
  const linksCount = item.externalLinks?.length ?? 0
  const hasDescription = Boolean(item.description)
  const enrichedCount = [hasDescription, commentsCount > 0, prsCount > 0, linksCount > 0].filter(Boolean).length

  const SOURCE_ICON = {
    extension: { icon: <Puzzle className="h-3 w-3" />, label: 'Ext', color: 'text-violet-300', bg: 'bg-violet-500/10' },
    csv: { icon: <Table2 className="h-3 w-3" />, label: 'CSV', color: 'text-sky-300', bg: 'bg-sky-500/10' },
    manual: { icon: <PenLine className="h-3 w-3" />, label: 'Manual', color: 'text-white/35', bg: 'bg-white/[0.05]' },
  }
  const src = SOURCE_ICON[item.source] ?? SOURCE_ICON.manual
  const cardAccent = cat.color
  const cardBorder = selected ? `${cardAccent}88` : `${cardAccent}3d`
  const cardShadow = selected
    ? `0 0 0 1px ${cardAccent}33, 0 18px 45px ${cardAccent}14`
    : `0 12px 34px ${cardAccent}08`
  const cardBackground = `linear-gradient(135deg, ${cardAccent}12 0%, rgba(255,255,255,0.025) 22%, rgba(255,255,255,0.012) 100%)`

  return (
    <div
      className={cn(
        'group relative flex min-h-[126px] flex-col overflow-hidden rounded-xl border p-3 transition-all duration-200',
        'hover:-translate-y-px hover:bg-white/[0.04]',
        isDone && 'opacity-55',
      )}
      style={{
        borderColor: cardBorder,
        background: cardBackground,
        boxShadow: cardShadow,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-80"
        style={{ background: `linear-gradient(180deg, ${cardAccent} 0%, ${cardAccent}55 55%, transparent 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${cardAccent}77 18%, ${cardAccent}22 48%, transparent 100%)` }}
      />
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onToggleSelect(item.id)}
          className={cn(
            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150',
            selected ? 'bg-primary border-primary text-white' : 'border-white/20 text-transparent hover:border-primary/50'
          )}
          aria-label="Selecionar card"
        >
          <span className="text-[9px] leading-none">✓</span>
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpen?.(item)}
              className={cn(
                'min-w-0 flex-1 text-left text-sm font-semibold leading-snug text-white/86 transition-colors hover:text-white',
                isDone && 'line-through text-white/40',
              )}
            >
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                {item.issueKey && (
                  <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none text-white/50">
                    {item.issueKey}
                  </span>
                )}
                <span className="min-w-0 flex-1 basis-48 line-clamp-2">{item.title}</span>
              </span>
            </button>

            <div className="flex shrink-0 items-center gap-1 opacity-45 transition-opacity duration-150 group-hover:opacity-100">
              {onOpen && (
                <button
                  onClick={() => onOpen(item)}
                  title="Ver detalhes"
                  className="rounded-md p-1 text-white/35 transition-colors duration-150 hover:bg-white/[0.06] hover:text-primary"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  title="Abrir no Jira"
                  className="rounded-md p-1 text-white/35 transition-colors duration-150 hover:bg-white/[0.06] hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none"
                style={{ backgroundColor: cat.color + '22', color: cat.color }}
              >
                {item.qaCategory}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none"
                style={{ backgroundColor: prio.color + '20', color: prio.color }}
              >
                {item.priority}
              </span>
              <span
                title={`Importado via ${item.source}`}
                className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none', src.color, src.bg)}
              >
                {src.icon}
                {src.label}
              </span>
              {item.importDepth === 'deep' && (
                <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold leading-none text-cyan-300">
                  Deep
                </span>
              )}
              {item.sentToDaily && (
                <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold leading-none text-emerald-300">
                  Daily
                </span>
              )}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-none text-white/32">
            {item.client && <span className="font-medium text-white/55">{item.client}</span>}
            {item.sprint && <span>{item.sprint}</span>}
            {item.assignee && <span>@{item.assignee}</span>}
            {item.type && <span className="text-primary/65">{item.type}</span>}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 border-t border-white/[0.05] pt-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {enrichedCount > 0 && (
            <>
              {hasDescription && (
                <span title="Descricao importada" className="inline-flex h-6 items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.025] px-1.5 text-[10px] leading-none text-white/38">
                  <FileText className="h-3 w-3" />
                  Desc
                </span>
              )}
              {commentsCount > 0 && (
                <span title="Comentarios importados" className="inline-flex h-6 items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.025] px-1.5 text-[10px] leading-none text-white/38">
                  <MessageSquare className="h-3 w-3" />
                  {commentsCount}
                </span>
              )}
              {prsCount > 0 && (
                <span title="Pull requests importados" className="inline-flex h-6 items-center gap-1 rounded-md border border-primary/15 bg-primary/10 px-1.5 text-[10px] leading-none text-primary/75">
                  <GitPullRequest className="h-3 w-3" />
                  {prsCount}
                </span>
              )}
              {linksCount > 0 && (
                <span title="Links importados" className="inline-flex h-6 items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.025] px-1.5 text-[10px] leading-none text-white/38">
                  <Link2 className="h-3 w-3" />
                  {linksCount}
                </span>
              )}
            </>
          )}
          <span className="inline-flex h-6 items-center gap-1 text-[10px] leading-none text-white/22">
            <Clock className="h-3 w-3" />
            {relTime(item.importedAt)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-55 transition-opacity duration-150 group-hover:opacity-100">
          {(!item.sentToDaily || item.dailyDate !== getLocalISODate()) && (
            <button
              onClick={() => onSendToDaily(item)}
              title={item.sentToDaily ? 'Reenviar para o Daily de hoje' : 'Send to Daily'}
              className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold text-primary/80 transition-all duration-150 hover:bg-primary/10 hover:text-primary"
            >
              <Send className="h-3 w-3" />
              Daily
            </button>
          )}
          {!isDone && (
            <button
              onClick={() => onMarkDone(item.id)}
              title="Mark as Done"
              className="rounded-lg p-1.5 text-white/25 transition-all duration-150 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              <CheckCircle className="h-3.5 w-3.5" />
            </button>
          )}
          {!isBlocked && !isDone && (
            <button
              onClick={() => onMarkBlocked(item.id)}
              title="Mark as Blocked"
              className="rounded-lg p-1.5 text-white/25 transition-all duration-150 hover:bg-amber-500/10 hover:text-amber-400"
            >
              <AlertCircle className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onRemove(item.id)}
            title="Remove"
            className="rounded-lg p-1.5 text-white/25 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
