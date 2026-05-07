'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, ChevronDown, ChevronUp, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useQAImporterStore,
  type QAItem, type QAItemSource, PRIORITY_ORDER,
} from '@/store/qa-importer'
import { useDailyStore, type DailyPriority, type DailyType } from '@/store/daily'
import type { ParsedQAItem } from '@/lib/qa-parser'

import { QASummaryCards }  from './qa-summary-cards'
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

export function QAImporterClient() {
  const store    = useQAImporterStore()
  const addTask  = useDailyStore(s => s.addTask)

  const [filters,       setFilters]       = useState<QAFilterState>(DEFAULT_FILTERS)
  const [selected,      setSelected]      = useState<Set<string>>(new Set())
  const [historyOpen,   setHistoryOpen]   = useState(false)
  const [groupBy,       setGroupBy]       = useState<'none' | 'client' | 'category' | 'priority'>('none')
  const [sentFeedback,  setSentFeedback]  = useState<string | null>(null)

  // ── Derived data ──────────────────────────────────────────────

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
        i.notes?.toLowerCase().includes(q)
      )
    }
    if (filters.client)      items = items.filter(i => i.client     === filters.client)
    if (filters.priority)    items = items.filter(i => i.priority   === filters.priority)
    if (filters.category)    items = items.filter(i => i.qaCategory === filters.category)
    if (filters.sprint)      items = items.filter(i => i.sprint     === filters.sprint)
    if (filters.sentToDaily !== 'all')
      items = items.filter(i => filters.sentToDaily === 'yes' ? i.sentToDaily : !i.sentToDaily)

    // Sort
    switch (filters.sortBy) {
      case 'priority': items.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]); break
      case 'newest':   items.sort((a, b) => b.importedAt.localeCompare(a.importedAt)); break
      case 'client':   items.sort((a, b) => a.client.localeCompare(b.client)); break
      case 'sprint':   items.sort((a, b) => (a.sprint ?? '').localeCompare(b.sprint ?? '')); break
    }

    return items
  }, [store.items, filters])

  // ── Group items ───────────────────────────────────────────────

  const grouped = useMemo(() => {
    if (groupBy === 'none') return null
    const map = new Map<string, QAItem[]>()
    filtered.forEach(item => {
      const key = groupBy === 'client'   ? item.client   :
                  groupBy === 'category' ? item.qaCategory :
                  item.priority
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    })
    return map
  }, [filtered, groupBy])

  // ── Actions ───────────────────────────────────────────────────

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const sendItemToDaily = useCallback((item: QAItem) => {
    const client = VALID_CLIENTS.has(item.client) ? item.client : 'Pessoal'
    const titleParts = [item.issueKey && `[${item.issueKey}]`, item.title].filter(Boolean)
    const notes      = [item.notes, item.link && `🔗 ${item.link}`].filter(Boolean).join(' · ')
    addTask({
      client,
      title:    titleParts.join(' '),
      type:     mapToDailyType(item.qaCategory),
      priority: mapToDailyPriority(item.priority),
      status:   'todo',
      notes:    notes || undefined,
    })
    store.markSentToDaily([item.id])
    setSentFeedback(`"${item.title}" enviado para o Daily`)
    setTimeout(() => setSentFeedback(null), 3000)
  }, [addTask, store])

  const sendSelectedToDaily = useCallback(() => {
    if (selected.size === 0) return
    const toSend = store.items.filter(i => selected.has(i.id) && !i.sentToDaily)
    toSend.forEach(sendItemToDaily)
    setSelected(new Set())
  }, [selected, store.items, sendItemToDaily])

  const sendAllToDaily = useCallback(() => {
    const notSent = store.items.filter(i => !i.sentToDaily)
    notSent.forEach(sendItemToDaily)
  }, [store.items, sendItemToDaily])

  const handleImport = useCallback((items: ParsedQAItem[], tabSource: 'text' | 'csv' | 'extension') => {
    const source: QAItemSource = tabSource === 'csv' ? 'csv' : tabSource === 'extension' ? 'extension' : 'manual'
    return store.importItems(items.map(i => ({ ...i, source })), source)
  }, [store])

  const markDone = (id: string) =>
    store.updateItem(id, { qaCategory: 'Done', status: 'Done' })

  const markBlocked = (id: string) =>
    store.updateItem(id, { qaCategory: 'Blocked', status: 'Blocked' })

  const selectedPending = [...selected].filter(id => !store.items.find(i => i.id === id)?.sentToDaily)

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <QASummaryCards items={store.items} />

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-5">

        {/* ── QA Items panel (left) ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">

          {/* Filter bar */}
          <QAFiltersBar
            filters={filters}
            onChange={setFilters}
            availableClients={availableClients}
            availableSprints={availableSprints}
            total={store.items.length}
            filtered={filtered.length}
          />

          {/* Selection toolbar */}
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10"
            >
              <span className="text-xs text-white/60">
                <span className="font-semibold text-white/85">{selected.size}</span> selecionados
                {selectedPending.length > 0 && ` · ${selectedPending.length} pendentes`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={sendSelectedToDaily}
                  disabled={selectedPending.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/25 border border-primary/40 text-primary hover:bg-primary/35 transition-all duration-150 disabled:opacity-40"
                >
                  <Send className="w-3 h-3" />
                  Enviar para Daily ({selectedPending.length})
                </button>
              </div>
            </motion.div>
          )}

          {/* Group by + Send All toolbar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-white/30" />
              <span className="text-white/30">Agrupar:</span>
              {(['none', 'client', 'category', 'priority'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGroupBy(g)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] transition-all duration-150',
                    groupBy === g ? 'bg-white/10 text-white/70' : 'text-white/30 hover:text-white/50',
                  )}
                >
                  {g === 'none' ? 'Nenhum' : g === 'client' ? 'Cliente' : g === 'category' ? 'Categoria' : 'Prioridade'}
                </button>
              ))}
            </div>

            <button
              onClick={sendAllToDaily}
              disabled={store.items.every(i => i.sentToDaily)}
              className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors duration-150 disabled:opacity-30"
            >
              <Send className="w-3 h-3" />
              Enviar todos para Daily
            </button>
          </div>

          {/* Feedback toast */}
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

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <p className="text-sm font-medium text-white/40">
                {store.items.length === 0 ? 'Nenhum item importado ainda' : 'Nenhum item corresponde aos filtros'}
              </p>
              <p className="text-xs text-white/20">
                {store.items.length === 0 ? 'Use o painel ao lado para importar tarefas QA do Jira' : 'Tente ajustar os filtros'}
              </p>
            </div>
          ) : grouped ? (
            // Grouped view
            <div className="space-y-5">
              {[...grouped.entries()].map(([groupKey, groupItems]) => (
                <div key={groupKey}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    {groupKey} ({groupItems.length})
                    <span className="h-px flex-1 bg-white/[0.06]" />
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {groupItems.map(item => (
                      <QACard
                        key={item.id}
                        item={item}
                        selected={selected.has(item.id)}
                        onToggleSelect={toggleSelect}
                        onSendToDaily={sendItemToDaily}
                        onMarkDone={markDone}
                        onMarkBlocked={markBlocked}
                        onRemove={store.removeItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat grid
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {filtered.map(item => (
                <QACard
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onToggleSelect={toggleSelect}
                  onSendToDaily={sendItemToDaily}
                  onMarkDone={markDone}
                  onMarkBlocked={markBlocked}
                  onRemove={store.removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

          {/* Import panel */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-white/85 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Importar do Jira
            </h2>
            <ImportPanel
              qaFilterEnabled={store.qaFilterEnabled}
              onQaFilterChange={store.setQaFilter}
              onImport={handleImport}
            />
          </div>

          {/* Import history */}
          <div className="glass-card overflow-hidden">
            <button
              onClick={() => setHistoryOpen(o => !o)}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-150"
            >
              <span className="text-sm font-semibold text-white/70">Histórico de Importações</span>
              {historyOpen
                ? <ChevronUp className="w-4 h-4 text-white/30" />
                : <ChevronDown className="w-4 h-4 text-white/30" />
              }
            </button>
            {historyOpen && (
              <div className="p-4">
                <ImportHistory history={store.history} />
              </div>
            )}
          </div>

          {/* Extension readiness notice */}
          <div className="glass-card p-4 border border-dashed border-white/[0.07]">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-1">Em breve</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Chrome Extension para importação automática de boards Jira — sem necessidade de copiar e colar.
            </p>
            <p className="text-[10px] text-white/20 mt-2 font-mono">handleQaImportPayload() ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}
