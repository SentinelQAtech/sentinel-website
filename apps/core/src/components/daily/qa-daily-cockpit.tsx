'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, Bot, Clipboard, ExternalLink, MessageSquareReply, PlayCircle, ShieldAlert, CheckCircle2, Crosshair, Inbox, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useQAImporterStore,
  type QAItem,
  type QADailyStatus,
  type QACategory,
} from '@/store/qa-importer'
import { QAResolutionDialog } from '@/components/qa-importer/qa-resolution-dialog'
import { QACopilotPanel } from '@/components/daily/qa-copilot-panel'
import { QACardPreviewDialog } from '@/components/daily/qa-card-preview-dialog'
import { rankItem, sortByRankMode, type RankSortMode } from '@/lib/qa-ranking'

const statusConfig: Record<QADailyStatus, { label: string; color: string; bg: string }> = {
  todo:    { label: 'Next',    color: 'text-white/55',    bg: 'bg-white/[0.05]' },
  doing:   { label: 'Doing',   color: 'text-primary',     bg: 'bg-primary/10' },
  done:    { label: 'Done',    color: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  blocked: { label: 'Blocked', color: 'text-red-300',     bg: 'bg-red-500/10' },
}

export function QADailyCockpit({ selectedDate }: { selectedDate: string }) {
  const items = useQAImporterStore(s => s.items)
  const updateDailyState = useQAImporterStore(s => s.updateDailyState)
  const updateItem = useQAImporterStore(s => s.updateItem)
  const moveDailyItem = useQAImporterStore(s => s.moveDailyItem)
  const saveResolution = useQAImporterStore(s => s.saveResolution)
  const [resolutionItem, setResolutionItem] = useState<QAItem | null>(null)

  const DAILY_TO_QA_CATEGORY: Record<QADailyStatus, QACategory> = {
    todo:    'Ready for QA',
    doing:   'In Testing',
    done:    'Done',
    blocked: 'Blocked',
  }

  // Daily and Board must point to the same QA item state.
  const setQAStatus = (itemId: string, status: QADailyStatus) => {
    updateDailyState(itemId, { dailyStatus: status })
    updateItem(itemId, { qaCategory: DAILY_TO_QA_CATEGORY[status], status: DAILY_TO_QA_CATEGORY[status] })
  }
  const [resolutionOpen, setResolutionOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [focusItemId, setFocusItemId] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<QAItem | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [sortMode, setSortMode] = useState<RankSortMode>('fastest')
  const [orderApplied, setOrderApplied] = useState(false)

  const dailyItems = useMemo(() => {
    const base = items
      .filter(item => item.sentToDaily && (item.dailyDate ?? selectedDate) === selectedDate)
      .sort((a, b) => (a.dailyOrder ?? 0) - (b.dailyOrder ?? 0))
    return sortByRankMode(base, sortMode)
  }, [items, selectedDate, sortMode])

  const applyOrder = () => {
    dailyItems.forEach((item, idx) => {
      updateDailyState(item.id, { dailyOrder: idx })
    })
    setSortMode('manual')
    setOrderApplied(true)
    setTimeout(() => setOrderApplied(false), 2000)
  }

  const copyReport = async (item: QAItem) => {
    if (!item.resolution?.report) return
    await navigator.clipboard?.writeText(item.resolution.report)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const openResolution = (item: QAItem) => {
    setResolutionItem(item)
    setResolutionOpen(true)
  }

  const isOpenForExecution = (item: QAItem) => {
    const status = item.dailyStatus ?? 'todo'
    return !item.resolution && status !== 'done' && status !== 'blocked'
  }

  const getNextOpenItem = (itemsToSearch: QAItem[], afterId?: string) => {
    const openItems = itemsToSearch.filter(isOpenForExecution)
    if (openItems.length === 0) return null
    if (!afterId) return openItems[0]

    const currentIndex = itemsToSearch.findIndex(item => item.id === afterId)
    const afterCurrent = openItems.find(item => itemsToSearch.findIndex(candidate => candidate.id === item.id) > currentIndex)
    return afterCurrent ?? openItems[0]
  }

  const startItem = (item: QAItem | null) => {
    if (!item) return
    setQAStatus(item.id, 'doing')
    setFocusItemId(item.id)
  }

  const startNextItem = () => {
    startItem(getNextOpenItem(dailyItems, focusItemId ?? undefined))
  }

  const counts = {
    pending: dailyItems.filter(item => (item.dailyStatus ?? 'todo') === 'todo').length,
    doing:   dailyItems.filter(item => item.dailyStatus === 'doing').length,
    done:    dailyItems.filter(item => item.dailyStatus === 'done').length,
    blocked: dailyItems.filter(item => item.dailyStatus === 'blocked').length,
  }
  const progressPct = dailyItems.length > 0 ? Math.round((counts.done / dailyItems.length) * 100) : 0
  const focusItem = dailyItems.find(item => item.id === focusItemId) ?? null
  const nextOpenItem = getNextOpenItem(dailyItems, focusItemId ?? undefined)

  return (
    <section className="glass-card border border-primary/15 p-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-base font-semibold text-white">QA do Dia</h2>
            {dailyItems.length > 0 && (
              <span className="text-xs text-white/35">
                {counts.done}/{dailyItems.length} resolvidos
              </span>
            )}
          </div>
          {dailyItems.length > 0 && (
            <div className="h-1 w-full max-w-xs rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? '#10b981' : '#6366f1' }}
              />
            </div>
          )}
          {dailyItems.length === 0 && (
            <p className="text-xs text-white/35">Fila de execução enviada do QA Importer para hoje.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] shrink-0">
          <Pill label="Next"    value={counts.pending} />
          <Pill label="Doing"   value={counts.doing}   color="text-primary" />
          <Pill label="Done"    value={counts.done}    color="text-emerald-300" />
          <Pill label="Blocked" value={counts.blocked} color="text-red-300" />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/85">Execução focada</p>
          <p className="mt-0.5 truncate text-xs text-white/35">
            {focusItem
              ? `Em foco: ${focusItem.issueKey || 'QA'} - ${focusItem.title}`
              : 'Comece pelo próximo card aberto da fila.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <ActionButton
            label={focusItem ? 'Próximo card' : 'Começar próximo'}
            onClick={startNextItem}
            active={false}
            disabled={!nextOpenItem}
          >
            <Crosshair className="h-3.5 w-3.5" />
          </ActionButton>
          {focusItem && (
            <ActionButton label="Responder no Focus" onClick={() => openResolution(focusItem)} active>
              <MessageSquareReply className="h-3.5 w-3.5" />
            </ActionButton>
          )}
        </div>
      </div>

      {focusItem && (
        <div data-testid="qa-focus-panel" className="rounded-xl border border-primary/25 bg-black/15 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[11px] font-bold text-white/55">
                  {focusItem.issueKey || 'QA'}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Focus QA
                </span>
                <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-white/45">
                  {focusItem.priority}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug text-white">{focusItem.title}</h3>
              <p className="mt-1 text-xs text-white/35">
                {[focusItem.client, focusItem.sprint, focusItem.assignee && `@${focusItem.assignee}`].filter(Boolean).join(' · ')}
              </p>
              {focusItem.notes && (
                <p className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3 text-xs leading-relaxed text-white/45">
                  {focusItem.notes}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <ActionButton
                label={copilotOpen ? 'Fechar Copilot' : 'QA Copilot'}
                onClick={() => setCopilotOpen(v => !v)}
                active={copilotOpen}
              >
                <Bot className="h-3.5 w-3.5" />
              </ActionButton>
              <ActionButton label="Responder no Focus" onClick={() => openResolution(focusItem)} active>
                <MessageSquareReply className="h-3.5 w-3.5" />
              </ActionButton>
              {focusItem.link && (
                <a
                  href={focusItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 text-xs font-medium text-white/45 hover:bg-white/[0.08] hover:text-white/70"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Jira
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {focusItem && copilotOpen && (
        <QACopilotPanel item={focusItem} />
      )}

      {dailyItems.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary/60" />
            <span className="text-[11px] text-white/35">Ordenar por:</span>
            {(
              [
                { mode: 'fastest',  label: '⚡ Mais rápidas' },
                { mode: 'priority', label: '🎯 Prioridade'   },
                { mode: 'bugs',     label: '🐛 Bugs primeiro' },
                { mode: 'manual',   label: '↕ Manual'        },
              ] as { mode: RankSortMode; label: string }[]
            ).map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                className={cn(
                  'rounded-lg border px-2 py-1 text-[10px] font-medium transition-colors',
                  sortMode === mode
                    ? 'border-primary/30 bg-primary/15 text-primary'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/35 hover:text-white/60 hover:bg-white/[0.06]',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {sortMode !== 'manual' && (
            <button
              type="button"
              onClick={applyOrder}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-colors',
                orderApplied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.07]',
              )}
            >
              {orderApplied ? '✓ Ordem salva' : 'Aplicar esta ordem'}
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {dailyItems.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-6 text-center">
            <Inbox className="mb-3 h-8 w-8 text-white/20" />
            <h3 className="text-sm font-semibold text-white/75">Nenhum card QA enviado para hoje</h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/35">
              Importe cards reais do Jira e envie para o Daily para montar sua fila de execução.
            </p>
            <Link
              href="/qa-inbox"
              className="mt-4 inline-flex h-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary/15"
            >
              Abrir QA Importer
            </Link>
          </div>
        ) : dailyItems.map((item, index) => {
          const status = item.dailyStatus ?? 'todo'
          const statusStyle = statusConfig[status]
          const rank = rankItem(item)

          return (
            <div
              key={item.id}
              data-testid="daily-qa-card"
              className={cn(
                'rounded-xl border transition-colors overflow-hidden',
                status === 'doing'   ? 'border-primary/30 bg-primary/[0.04]' :
                status === 'blocked' ? 'border-red-500/20 bg-red-500/[0.03]' :
                                       'border-white/[0.07] bg-white/[0.025]',
                status === 'done'    && 'opacity-60',
              )}
            >
              {/* Main row */}
              <div className="flex items-center gap-3 p-3">
                {/* Index + reorder */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <IconButton title="Mover para cima" disabled={index === 0} onClick={() => moveDailyItem(item.id, 'up')}>
                    <ArrowUp className="h-3 w-3" />
                  </IconButton>
                  <span className="text-[10px] font-semibold text-white/25">#{index + 1}</span>
                  <IconButton title="Mover para baixo" disabled={index === dailyItems.length - 1} onClick={() => moveDailyItem(item.id, 'down')}>
                    <ArrowDown className="h-3 w-3" />
                  </IconButton>
                </div>

                {/* Content — clicável para preview */}
                <button
                  type="button"
                  onClick={() => setPreviewItem(item)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-white/45 bg-white/[0.06] px-1.5 py-0.5 rounded">
                      {item.issueKey || 'QA'}
                    </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusStyle.bg, statusStyle.color)}>
                      {statusStyle.label}
                    </span>
                    {sortMode !== 'manual' && (
                      <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', rank.tagColor)}>
                        {rank.tag}
                      </span>
                    )}
                    {sortMode !== 'manual' && (
                      <span className="text-[10px] text-white/25">~{rank.estimatedMinutes}min</span>
                    )}
                    {item.resolution && (
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white/65">
                        {item.resolution.result}
                      </span>
                    )}
                    {item.priority && item.priority !== 'Unknown' && (
                      <span className="text-[10px] text-white/30">{item.priority}</span>
                    )}
                  </div>
                  <p className={cn('text-sm font-medium leading-snug', status === 'done' ? 'line-through text-white/30' : 'text-white/85')}>
                    {item.title}
                  </p>
                  {(item.sprint || item.client) && (
                    <p className="mt-1 text-[11px] text-white/30">
                      {[item.sprint, item.client].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </button>

                {/* Actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <ActionButton label="Doing" onClick={() => setQAStatus(item.id, 'doing')} active={status === 'doing'}>
                      <PlayCircle className="h-3.5 w-3.5" />
                    </ActionButton>
                    <ActionButton label="Done" onClick={() => setQAStatus(item.id, 'done')} active={status === 'done'}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </ActionButton>
                    <ActionButton label="Blocked" onClick={() => setQAStatus(item.id, 'blocked')} active={status === 'blocked'}>
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </ActionButton>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton title="Responder card" onClick={() => openResolution(item)}>
                      <MessageSquareReply className="h-3.5 w-3.5" />
                    </IconButton>
                    {item.resolution?.report && (
                      <IconButton title={copiedId === item.id ? 'Copiado!' : 'Copiar report'} onClick={() => copyReport(item)}>
                        <Clipboard className="h-3.5 w-3.5" />
                      </IconButton>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Abrir no Jira"
                        className="inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 text-xs font-medium text-white/45 hover:bg-white/[0.08] hover:text-white/70"
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )
        })}
      </div>

      <QACardPreviewDialog item={previewItem} onClose={() => setPreviewItem(null)} />

      <QAResolutionDialog
        item={resolutionItem}
        open={resolutionOpen}
        onOpenChange={setResolutionOpen}
        onSave={(id, resolution) => {
          saveResolution(id, resolution)
          setResolutionOpen(false)
          const nextItem = useQAImporterStore.getState().items.find(item => item.id === id) ?? null
          setResolutionItem(nextItem)
          if (id === focusItemId) {
            const updatedDailyItems = useQAImporterStore.getState().items
              .filter(item => item.sentToDaily && (item.dailyDate ?? selectedDate) === selectedDate)
              .sort((a, b) => (a.dailyOrder ?? 0) - (b.dailyOrder ?? 0))
            const upcomingItem = getNextOpenItem(updatedDailyItems, id)
            if (upcomingItem) {
              setQAStatus(upcomingItem.id, 'doing')
              setFocusItemId(upcomingItem.id)
            } else {
              setFocusItemId(null)
            }
          }
        }}
      />
    </section>
  )
}

function Pill({ label, value, color = 'text-white/55' }: { label: string; value: number; color?: string }) {
  return (
    <span className="rounded-lg border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-white/35">
      {label}: <span className={cn('font-semibold', color)}>{value}</span>
    </span>
  )
}

function IconButton({
  title,
  disabled,
  onClick,
  children,
}: {
  title: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 text-xs font-medium text-white/45 hover:bg-white/[0.08] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}

function ActionButton({
  label,
  active,
  onClick,
  disabled,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-8 items-center justify-center gap-1 rounded-lg border px-2 text-xs font-medium transition-colors',
        active
          ? 'border-primary/30 bg-primary/15 text-primary'
          : 'border-white/[0.08] bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-white/[0.04] hover:text-white/45',
      )}
    >
      {children}
      {label}
    </button>
  )
}

