'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Layers, Upload, X, ClipboardList, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useQAImporterStore,
  type QAItem, type QAItemSource, PRIORITY_ORDER,
} from '@/store/qa-importer'
import { useDailyStore, getTodayISO, type DailyPriority, type DailyType } from '@/store/daily'
import type { ParsedQAItem } from '@/lib/qa-parser'

import { QAFiltersBar, DEFAULT_FILTERS, type QAFilterState } from './qa-filters'
import { QACard }          from './qa-card'
import { ImportPanel }     from './import-panel'
import { ImportHistory }   from './import-history'

const VALID_CLIENTS   = new Set(['UOL', 'Concepta', 'ScrumLaunch', 'Ambev', 'Pessoal'])
const DAILY_PRIORITY  = new Set(['Critical', 'High', 'Medium', 'Low'])

function mapToDailyType(cat: QAItem['qaCategory']): DailyType {
  if (cat === 'Review') return 'Review'
  if (cat === 'Blocked') return 'QA Planning'
  return 'Testing'
}

function mapToDailyPriority(p: QAItem['priority']): DailyPriority {
  return DAILY_PRIORITY.has(p) ? (p as DailyPriority) : 'Medium'
}

function buildEnrichedNotes(item: QAItem): string {
  const comments = item.comments?.slice(0, 5).map((c, i) => `Comentario ${i + 1}: ${c.body}`).join('\n\n')
  const prs      = item.pullRequests?.map(l => `PR: ${l.text || l.url} - ${l.url}`).join('\n')
  const links    = item.externalLinks?.slice(0, 8).map(l => `Link: ${l.text || l.url} - ${l.url}`).join('\n')
  return [item.notes, item.description && `Descricao:\n${item.description}`, comments, prs, links].filter(Boolean).join('\n\n')
}

// ─── TasksClient ──────────────────────────────────────────

export function TasksClient() {
  const store   = useQAImporterStore()
  const addTask = useDailyStore(s => s.addTask)

  const [filters,      setFilters]      = useState<QAFilterState>(DEFAULT_FILTERS)
  const [selected,     setSelected]     = useState<Set<string>>(new Set())
  const [historyOpen,  setHistoryOpen]  = useState(false)
  const [importOpen,   setImportOpen]   = useState(false)
  const [groupBy,      setGroupBy]      = useState<'none' | 'client' | 'category' | 'priority'>('none')
  const [sentFeedback, setSentFeedback] = useState<string | null>(null)
  const [detailItem,   setDetailItem]   = useState<QAItem | null>(null)

  // ── Stats ─────────────────────────────────────────────────

  const stats = useMemo(() => {
    const items = store.items
    return {
      total:     items.length,
      pending:   items.filter(i => !i.sentToDaily && i.qaCategory !== 'Done' && i.qaCategory !== 'Blocked').length,
      daily:     items.filter(i => i.sentToDaily).length,
      done:      items.filter(i => i.qaCategory === 'Done').length,
      blocked:   items.filter(i => i.qaCategory === 'Blocked').length,
    }
  }, [store.items])

  // ── Derived data ──────────────────────────────────────────

  const availableClients = useMemo(
    () => [...new Set(store.items.map(i => i.client).filter(Boolean))].sort(),
    [store.items]
  )
  const availableSprints = useMemo(
    () => [...new Set(store.items.map(i => i.sprint ?? '').filter(Boolean))].sort(),
    [store.items]
  )

  const filtered = useMemo(() => {
    let items = [...store.items]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.issueKey.toLowerCase().includes(q) ||
        i.notes?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.comments?.some(c => c.body.toLowerCase().includes(q))
      )
    }
    if (filters.client)    items = items.filter(i => i.client     === filters.client)
    if (filters.priority)  items = items.filter(i => i.priority   === filters.priority)
    if (filters.category)  items = items.filter(i => i.qaCategory === filters.category)
    if (filters.sprint)    items = items.filter(i => i.sprint     === filters.sprint)
    if (filters.sentToDaily !== 'all')
      items = items.filter(i => filters.sentToDaily === 'yes' ? i.sentToDaily : !i.sentToDaily)

    switch (filters.sortBy) {
      case 'priority': items.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]); break
      case 'newest':   items.sort((a, b) => b.importedAt.localeCompare(a.importedAt)); break
      case 'client':   items.sort((a, b) => a.client.localeCompare(b.client)); break
      case 'sprint':   items.sort((a, b) => (a.sprint ?? '').localeCompare(b.sprint ?? '')); break
    }
    return items
  }, [store.items, filters])

  const grouped = useMemo(() => {
    if (groupBy === 'none') return null
    const map = new Map<string, QAItem[]>()
    filtered.forEach(item => {
      const key = groupBy === 'client' ? item.client : groupBy === 'category' ? item.qaCategory : item.priority
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    })
    return map
  }, [filtered, groupBy])

  // ── Actions ───────────────────────────────────────────────

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const sendItemToDaily = useCallback((item: QAItem) => {
    const client    = VALID_CLIENTS.has(item.client) ? item.client : 'Pessoal'
    const titleParts = [item.issueKey && `[${item.issueKey}]`, item.title].filter(Boolean)
    addTask({ date: getTodayISO(), client, title: titleParts.join(' '), type: mapToDailyType(item.qaCategory), priority: mapToDailyPriority(item.priority), status: 'todo', notes: buildEnrichedNotes(item) || undefined })
    store.markSentToDaily([item.id])
    setSentFeedback(`"${item.title}" enviado para o Daily`)
    setTimeout(() => setSentFeedback(null), 3000)
  }, [addTask, store])

  const sendSelectedToDaily = useCallback(() => {
    store.items.filter(i => selected.has(i.id) && !i.sentToDaily).forEach(sendItemToDaily)
    setSelected(new Set())
  }, [selected, store.items, sendItemToDaily])

  const sendAllToDaily = useCallback(() => {
    store.items.filter(i => !i.sentToDaily).forEach(sendItemToDaily)
  }, [store.items, sendItemToDaily])

  const handleImport = useCallback((items: ParsedQAItem[], tabSource: 'text' | 'csv' | 'extension') => {
    const source: QAItemSource = tabSource === 'csv' ? 'csv' : tabSource === 'extension' ? 'extension' : 'manual'
    return store.importItems(items.map(i => ({ ...i, source })), source)
  }, [store])

  const markDone    = (id: string) => store.updateItem(id, { qaCategory: 'Done',    status: 'Done'    })
  const markBlocked = (id: string) => store.updateItem(id, { qaCategory: 'Blocked', status: 'Blocked' })

  const selectedPending = [...selected].filter(id => !store.items.find(i => i.id === id)?.sentToDaily)

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* Stats strip */}
      {store.items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<ClipboardList className="h-4 w-4" />} label="Total" value={stats.total} />
          <StatCard icon={<Clock className="h-4 w-4" />}         label="Pendentes" value={stats.pending} color="text-amber-400" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />}  label="Concluídas" value={stats.done}   color="text-emerald-400" />
          <StatCard icon={<ShieldAlert className="h-4 w-4" />}   label="Bloqueadas" value={stats.blocked} color="text-red-400" />
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-5">

        {/* ── Tasks list ── */}
        <div className={cn('col-span-12 flex flex-col gap-4', importOpen ? 'lg:col-span-8' : 'lg:col-span-12')}>

          <QAFiltersBar
            filters={filters}
            onChange={setFilters}
            availableClients={availableClients}
            availableSprints={availableSprints}
            total={store.items.length}
            filtered={filtered.length}
          />

          {/* Selection toolbar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10"
              >
                <span className="text-xs text-white/60">
                  <span className="font-semibold text-white/85">{selected.size}</span> selecionados
                  {selectedPending.length > 0 && ` · ${selectedPending.length} pendentes`}
                </span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-white/40 hover:text-white/60 transition-colors">
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={sendSelectedToDaily}
                    disabled={selectedPending.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/25 border border-primary/40 text-primary hover:bg-primary/35 transition-all disabled:opacity-40"
                  >
                    <Send className="w-3 h-3" />
                    Enviar para Daily ({selectedPending.length})
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Group by + Send All */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-white/30" />
              <span className="text-white/30">Agrupar:</span>
              {(['none', 'client', 'category', 'priority'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroupBy(g)}
                  className={cn('px-2 py-0.5 rounded text-[11px] transition-all', groupBy === g ? 'bg-white/10 text-white/70' : 'text-white/30 hover:text-white/50')}
                >
                  {g === 'none' ? 'Nenhum' : g === 'client' ? 'Cliente' : g === 'category' ? 'Categoria' : 'Prioridade'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={sendAllToDaily}
              disabled={store.items.every(i => i.sentToDaily)}
              className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors disabled:opacity-30"
            >
              <Send className="w-3 h-3" />
              Enviar todos para Daily
            </button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {sentFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-xs text-emerald-400"
              >
                ✓ {sentFeedback}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards */}
          {filtered.length === 0 ? (
            <EmptyState hasItems={store.items.length > 0} onImport={() => setImportOpen(true)} />
          ) : grouped ? (
            <div className="space-y-6">
              {[...grouped.entries()].map(([groupKey, groupItems]) => (
                <div key={groupKey}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    {groupKey} ({groupItems.length})
                    <span className="h-px flex-1 bg-white/[0.06]" />
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {groupItems.map(item => (
                      <QACard key={item.id} item={item} selected={selected.has(item.id)}
                        onToggleSelect={toggleSelect} onSendToDaily={sendItemToDaily}
                        onMarkDone={markDone} onMarkBlocked={markBlocked}
                        onRemove={store.removeItem} onOpen={setDetailItem} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {filtered.map(item => (
                <QACard key={item.id} item={item} selected={selected.has(item.id)}
                  onToggleSelect={toggleSelect} onSendToDaily={sendItemToDaily}
                  onMarkDone={markDone} onMarkBlocked={markBlocked}
                  onRemove={store.removeItem} onOpen={setDetailItem} />
              ))}
            </div>
          )}
        </div>

        {/* ── Import panel (right) ── */}
        <AnimatePresence>
          {importOpen && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="col-span-12 lg:col-span-4 flex flex-col gap-4"
            >
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white/85 flex items-center gap-2">
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    Importar Tasks
                  </h2>
                  <button
                    type="button"
                    aria-label="Fechar painel de importação"
                    onClick={() => setImportOpen(false)}
                    className="rounded-lg p-1.5 text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ImportPanel
                  qaFilterEnabled={store.qaFilterEnabled}
                  onQaFilterChange={store.setQaFilter}
                  onImport={handleImport}
                />
              </div>

              <div className="glass-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setHistoryOpen(o => !o)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-semibold text-white/60">Histórico</span>
                  <span className="text-[10px] text-white/30">{historyOpen ? '▲' : '▼'}</span>
                </button>
                {historyOpen && (
                  <div className="px-4 pb-4 border-t border-white/[0.06]">
                    <ImportHistory history={store.history} />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-dashed border-primary/[0.15] bg-primary/[0.03] p-4">
                <p className="text-[11px] font-semibold text-primary/50 uppercase tracking-wider mb-1">Sentinel QA Sync</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  Extensão Chrome ativa — sincronize cards do board Jira e abra esta página para importá-los automaticamente.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      {detailItem && (
        <TaskDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}

      {/* Importar FAB — visible when panel is closed */}
      {!importOpen && (
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:bg-primary/85 transition-all"
        >
          <Upload className="h-4 w-4" />
          Importar
        </button>
      )}
    </div>
  )
}

// Keep old export name for compatibility with any imports that still use it
export { TasksClient as QAImporterClient }

// ─── Sub-components ───────────────────────────────────────

function StatCard({ icon, label, value, color = 'text-white/70' }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
      <span className="text-white/25">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
        <p className={cn('text-xl font-bold leading-none mt-0.5', color)}>{value}</p>
      </div>
    </div>
  )
}

function EmptyState({ hasItems, onImport }: { hasItems: boolean; onImport: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.015]">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <ClipboardList className="h-6 w-6 text-primary/60" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white/50">
          {hasItems ? 'Nenhuma task corresponde aos filtros' : 'Nenhuma task importada ainda'}
        </p>
        <p className="text-xs text-white/25 mt-1">
          {hasItems ? 'Tente ajustar os filtros' : 'Use o botão Importar para adicionar tasks'}
        </p>
      </div>
      {!hasItems && (
        <button
          type="button"
          onClick={onImport}
          className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/25 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/25 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Importar tasks
        </button>
      )}
    </div>
  )
}

function TaskDetailModal({ item, onClose }: { item: QAItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="relative dropdown-panel w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {item.issueKey && <span className="font-mono text-xs font-bold text-primary">{item.issueKey}</span>}
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/55">{item.qaCategory}</span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/55">{item.priority}</span>
            </div>
            <h2 className="text-base font-semibold leading-snug text-white">{item.title}</h2>
          </div>
          <button type="button" aria-label="Fechar" onClick={onClose} className="shrink-0 rounded-lg p-2 text-white/35 hover:bg-white/[0.06] hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Cliente',     value: item.client || '-' },
              { label: 'Sprint',      value: item.sprint || '-' },
              { label: 'Responsável', value: item.assignee || '-' },
              { label: 'Status',      value: item.status || '-' },
              { label: 'Tipo',        value: item.type || '-' },
              { label: 'Importado',   value: new Date(item.importedAt).toLocaleString('pt-BR') },
              { label: 'Daily',       value: item.sentToDaily ? 'Enviado' : 'Pendente' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
                <p className="truncate text-sm text-white/70">{value}</p>
              </div>
            ))}
          </div>

          {[
            { label: 'Notas',           content: item.notes },
            { label: 'Descrição Jira',  content: item.description },
          ].filter(s => s.content).map(({ label, content }) => (
            <section key={label}>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">{label}</h3>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/65">{content}</p>
              </div>
            </section>
          ))}

          {(item.comments?.length ?? 0) > 0 && (
            <section>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">Comentários Jira</h3>
              <div className="space-y-2">
                {item.comments?.map((comment, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/65">{comment.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
