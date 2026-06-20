'use client'

import { useState, useMemo, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Layers, Upload, X, ClipboardList, CheckCircle2, Clock, ShieldAlert, ChevronDown, ChevronRight, Archive, AlertTriangle, FileText, GitPullRequest, MessageSquare, ExternalLink, PanelRightOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useQAImporterStore,
  type QAItem, type QAItemSource, type ArchivedSession, PRIORITY_ORDER, QA_CATEGORY_CONFIG, getLocalISODate,
} from '@/store/qa-importer'
import {
  useArchiveQAItem,
  useImportQAItems,
  useQAItems,
  useSendQAItemToDaily,
  useUpdateQAItem,
  type QAItemInput,
} from '@/hooks/useQAItems'
import type { ParsedQAItem } from '@/lib/qa-parser'

import { QAFiltersBar, DEFAULT_FILTERS, type QAFilterState } from './qa-filters'
import { QACard }          from './qa-card'
import { ImportPanel }     from './import-panel'
import { ImportHistory }   from './import-history'
import { FormattedText }   from './formatted-text'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/lib/api-error'

function cleanJiraText(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/(More options|Suggest a reply|Status update|Thanks\.?)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isUsefulJiraComment(value: string) {
  const clean = cleanJiraText(value)
  if (clean.length < 18) return false
  if (/^add a comment/i.test(clean)) return false
  if (/^pro tip:/i.test(clean)) return false
  return true
}

function formatCommentDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// ─── QA Inbox Client ──────────────────────────────────────

export function TasksClient() {
  const store   = useQAImporterStore()
  const { data: remoteItems = [], isLoading, isError } = useQAItems()
  const importQAItems = useImportQAItems()
  const updateQAItem = useUpdateQAItem()
  const archiveQAItem = useArchiveQAItem()
  const sendQAItemToDaily = useSendQAItemToDaily()

  const [filters,       setFilters]       = useState<QAFilterState>(DEFAULT_FILTERS)
  const [selected,      setSelected]      = useState<Set<string>>(new Set())
  const [historyOpen,   setHistoryOpen]   = useState(false)
  const [importOpen,    setImportOpen]    = useState(false)
  const [groupBy,       setGroupBy]       = useState<'none' | 'client' | 'category' | 'priority'>('none')
  const [sentFeedback,  setSentFeedback]  = useState<string | null>(null)
  const [sendingDailyIds, setSendingDailyIds] = useState<Set<string>>(new Set())
  const [detailItem,    setDetailItem]    = useState<QAItem | null>(null)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  // ── Stats ─────────────────────────────────────────────────

  const todayISO = getLocalISODate()

  const stats = useMemo(() => {
    const items = remoteItems
    return {
      total:     items.length,
      pending:   items.filter(i => (!i.sentToDaily || i.dailyDate !== todayISO) && i.qaCategory !== 'Done' && i.qaCategory !== 'Blocked').length,
      daily:     items.filter(i => i.sentToDaily && i.dailyDate === todayISO).length,
      done:      items.filter(i => i.qaCategory === 'Done').length,
      blocked:   items.filter(i => i.qaCategory === 'Blocked').length,
    }
  }, [remoteItems, todayISO])

  // ── Derived data ──────────────────────────────────────────

  const availableClients = useMemo(
    () => [...new Set(remoteItems.map(i => i.client).filter(Boolean))].sort(),
    [remoteItems]
  )
  const availableSprints = useMemo(
    () => [...new Set(remoteItems.map(i => i.sprint ?? '').filter(Boolean))].sort(),
    [remoteItems]
  )

  const filtered = useMemo(() => {
    let items = [...remoteItems]
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
  }, [remoteItems, filters])

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

  const sendItemToDaily = useCallback(async (item: QAItem) => {
    setSendingDailyIds(current => new Set(current).add(item.id))
    try {
      await sendQAItemToDaily.mutateAsync({ id: item.id, dailyDate: todayISO })
      const message = `"${item.title}" enviado para o Daily`
      setSentFeedback(message)
      toast.success(message)
      setTimeout(() => setSentFeedback(null), 3000)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Nao foi possivel adicionar o item ao QA do dia.'))
    } finally {
      setSendingDailyIds(current => {
        const next = new Set(current)
        next.delete(item.id)
        return next
      })
    }
  }, [sendQAItemToDaily, todayISO])

  const isNotSentToday = useCallback((i: QAItem) => !i.sentToDaily || i.dailyDate !== todayISO, [todayISO])

  const sendSelectedToDaily = useCallback(async () => {
    const items = remoteItems.filter(i => selected.has(i.id) && isNotSentToday(i))
    await Promise.all(items.map(sendItemToDaily))
    setSelected(new Set())
  }, [selected, remoteItems, sendItemToDaily, isNotSentToday])

  const sendAllToDaily = useCallback(async () => {
    await Promise.all(remoteItems.filter(isNotSentToday).map(sendItemToDaily))
  }, [remoteItems, sendItemToDaily, isNotSentToday])

  const handleImport = useCallback(async (items: ParsedQAItem[], tabSource: 'text' | 'csv' | 'extension') => {
    const source: QAItemSource = tabSource === 'csv' ? 'csv' : tabSource === 'extension' ? 'extension' : 'manual'
    const payload: QAItemInput[] = items.map(item => ({
      title: item.title,
      clientName: item.client,
      description: item.description,
      source,
      externalKey: item.issueKey,
      externalUrl: item.link,
      priority: item.priority,
      category: item.qaCategory,
      status: item.status || item.qaCategory,
      notes: item.notes,
      itemType: item.type,
      metadata: {
        sprintName: item.sprint,
        assignee: item.assignee,
        comments: item.comments,
        devNotes: item.devNotes,
        pullRequests: item.pullRequests,
        externalLinks: item.externalLinks,
        importDepth: item.importDepth,
        deepImportError: item.deepImportError,
      },
    }))
    const result = await importQAItems.mutateAsync({ items: payload })
    return { added: result.added, updated: result.updated, total: result.total }
  }, [importQAItems])

  const markDone    = (id: string) => updateQAItem.mutate({ id, updates: { category: 'Done', status: 'Done', workflowState: 'done' } })
  const markBlocked = (id: string) => updateQAItem.mutate({ id, updates: { category: 'Blocked', status: 'Blocked', workflowState: 'blocked' } })

  const selectedPending = [...selected].filter(id => {
    const item = remoteItems.find(i => i.id === id)
    return item ? isNotSentToday(item) : false
  })

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {isError && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Nao foi possivel carregar a QA Inbox pela API.
        </div>
      )}
      {isLoading && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/45">
          Carregando QA Items...
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">QA Inbox</h1>
            <p className="text-xs text-white/35 mt-0.5">
              {remoteItems.length > 0
                ? `${remoteItems.length} item${remoteItems.length !== 1 ? 's' : ''} · revise e envie para Today`
                : 'Importe itens QA para começar'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setImportOpen(o => !o)}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0',
            importOpen
              ? 'border border-white/[0.10] bg-white/[0.05] text-white/60'
              : 'bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-primary/85',
          )}
        >
          <PanelRightOpen className="h-4 w-4" />
          {importOpen ? 'Fechar' : 'Importar'}
        </button>
      </div>

      {/* Stats strip + archive action */}
      {remoteItems.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={<ClipboardList className="h-4 w-4" />} label="Total"      value={stats.total}   />
            <StatCard icon={<Clock className="h-4 w-4" />}         label="Pendentes"  value={stats.pending}  color="text-amber-400" />
            <StatCard icon={<CheckCircle2 className="h-4 w-4" />}  label="Concluídas" value={stats.done}     color="text-emerald-400" />
            <StatCard icon={<ShieldAlert className="h-4 w-4" />}   label="Bloqueadas" value={stats.blocked}  color="text-red-400" />
          </div>

          <AnimatePresence mode="wait">
            {!confirmArchive ? (
              <motion.div key="archive-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  onClick={() => setConfirmArchive(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/35 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400 transition-all"
                >
                  <Archive className="h-3.5 w-3.5" />
                  Arquivar e limpar board
                </button>
              </motion.div>
            ) : (
              <motion.div key="archive-confirm" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-xs text-amber-300/80">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>Arquivar <strong className="text-amber-300">{stats.total} itens QA</strong> e limpar o board? O histórico fica salvo.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => setConfirmArchive(false)}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => { remoteItems.forEach(item => archiveQAItem.mutate(item.id)); setConfirmArchive(false) }}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
                  >
                    <Archive className="h-3 w-3" />
                    Confirmar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-5">

        {/* ── QA Inbox list ── */}
        <div className="col-span-12 flex flex-col gap-4">

          <QAFiltersBar
            filters={filters}
            onChange={setFilters}
            availableClients={availableClients}
            availableSprints={availableSprints}
            total={remoteItems.length}
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
              disabled={remoteItems.every(i => !isNotSentToday(i))}
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
            <EmptyState hasItems={remoteItems.length > 0} onImport={() => setImportOpen(true)} />
          ) : grouped ? (
            <div className="space-y-6">
              {[...grouped.entries()].map(([groupKey, groupItems]) => (
                <div key={groupKey}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    {groupKey} ({groupItems.length})
                    <span className="h-px flex-1 bg-white/[0.06]" />
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 2xl:grid-cols-3">
                    {groupItems.map(item => (
                      <QACard key={item.id} item={item} selected={selected.has(item.id)} sendingToDaily={sendingDailyIds.has(item.id)}
                        onToggleSelect={toggleSelect} onSendToDaily={sendItemToDaily}
                        onMarkDone={markDone} onMarkBlocked={markBlocked}
                        onRemove={(id) => archiveQAItem.mutate(id)} onOpen={setDetailItem} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 2xl:grid-cols-3">
              {filtered.map(item => (
                <QACard key={item.id} item={item} selected={selected.has(item.id)} sendingToDaily={sendingDailyIds.has(item.id)}
                  onToggleSelect={toggleSelect} onSendToDaily={sendItemToDaily}
                  onMarkDone={markDone} onMarkBlocked={markBlocked}
                  onRemove={(id) => archiveQAItem.mutate(id)} onOpen={setDetailItem} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Import Dialog ── */}
      <Dialog.Root open={importOpen} onOpenChange={setImportOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
              'rounded-2xl border border-primary/20 bg-[#13151f] shadow-[0_32px_80px_rgba(0,0,0,0.7)]',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
              'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
              'duration-200 overflow-hidden',
            )}
          >
            {/* Colored header */}
            <div className="relative flex items-start justify-between gap-4 bg-gradient-to-b from-primary/[0.18] to-transparent px-6 pt-6 pb-5 border-b border-primary/[0.12]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/25 border border-primary/30">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-bold text-white">Importar itens QA</Dialog.Title>
                  <Dialog.Description className="text-xs text-white/40 mt-0.5">
                    Selecione a empresa e importe os itens que entraram para QA
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close
                className="shrink-0 rounded-lg p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors mt-0.5"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(100vh-10rem)] px-6 py-5 space-y-5">
              <ImportPanel
                qaFilterEnabled={store.qaFilterEnabled}
                onQaFilterChange={store.setQaFilter}
                onImport={handleImport}
                onSuccess={() => setTimeout(() => setImportOpen(false), 1800)}
              />

              {/* Import history (collapsible inside dialog) */}
              {store.history.length > 0 && (
                <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setHistoryOpen(o => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-xs font-semibold text-white/45">Histórico de importações</span>
                    <span className="text-[10px] text-white/25">{historyOpen ? '▲' : '▼'}</span>
                  </button>
                  {historyOpen && (
                    <div className="px-4 pb-4 border-t border-white/[0.06]">
                      <ImportHistory history={store.history} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Sessões anteriores */}
      {store.archivedSessions.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/30">
            <Archive className="h-3.5 w-3.5" />
            Sessões anteriores
            <span className="text-white/20 font-normal normal-case tracking-normal">({store.archivedSessions.length})</span>
          </h3>
          <div className="space-y-2">
            {store.archivedSessions.map(session => (
              <SessionRow
                key={session.id}
                session={session}
                isExpanded={expandedSession === session.id}
                onToggle={() => setExpandedSession(prev => prev === session.id ? null : session.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailItem && (
        <TaskDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}

    </div>
  )
}

// Keep old export name for compatibility with any imports that still use it
export { TasksClient as QAImporterClient }

// ─── Sub-components ───────────────────────────────────────

function SessionRow({ session, isExpanded, onToggle }: { session: ArchivedSession; isExpanded: boolean; onToggle: () => void }) {
  const date = new Date(session.archivedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  const time = new Date(session.archivedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const { counts } = session

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        {isExpanded
          ? <ChevronDown className="h-3.5 w-3.5 text-white/25 shrink-0" />
          : <ChevronRight className="h-3.5 w-3.5 text-white/25 shrink-0" />
        }

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] text-white/50">{date}</span>
            <span className="text-white/20 text-[11px]">{time}</span>
            {session.sprint && (
              <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] font-medium text-white/45">
                {session.sprint}
              </span>
            )}
          </div>
        </div>

        {/* Result counts */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-semibold text-white/35">{counts.total} itens</span>
          {counts.pass > 0    && <CountBadge value={counts.pass}    label="P" color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20" />}
          {counts.fail > 0    && <CountBadge value={counts.fail}    label="F" color="text-red-400 bg-red-500/10 border-red-500/20" />}
          {counts.partial > 0 && <CountBadge value={counts.partial} label="~" color="text-amber-400 bg-amber-500/10 border-amber-500/20" />}
          {counts.blocked > 0 && <CountBadge value={counts.blocked} label="B" color="text-orange-400 bg-orange-500/10 border-orange-500/20" />}
          {counts.pending > 0 && <CountBadge value={counts.pending} label="?" color="text-white/30 bg-white/[0.05] border-white/[0.08]" />}
        </div>
      </button>

      {/* Expanded: card list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-4 py-3 space-y-1.5 max-h-72 overflow-y-auto">
              {session.items.map(item => (
                <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="font-mono text-[10px] text-white/35 shrink-0 w-16 truncate">{item.issueKey || '—'}</span>
                  <span className="flex-1 text-xs text-white/60 truncate">{item.title}</span>
                  {item.resolution ? (
                    <ResultBadge result={item.resolution.result} />
                  ) : (
                    <span className="text-[10px] text-white/25 shrink-0">{item.qaCategory}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CountBadge({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px] font-bold', color)}>
      {value}{label}
    </span>
  )
}

function ResultBadge({ result }: { result: string }) {
  const cfg: Record<string, string> = {
    PASS:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    FAIL:    'text-red-400 bg-red-500/10 border-red-500/20',
    PARTIAL: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    BLOCKED: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  }
  return (
    <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold', cfg[result] ?? 'text-white/30 bg-white/[0.05] border-white/[0.08]')}>
      {result}
    </span>
  )
}

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
          {hasItems ? 'Nenhum item QA corresponde aos filtros' : 'Nenhum item QA importado ainda'}
        </p>
        <p className="text-xs text-white/25 mt-1">
          {hasItems ? 'Tente ajustar os filtros' : 'Use o botão Importar para adicionar itens QA'}
        </p>
      </div>
      {!hasItems && (
        <button
          type="button"
          onClick={onImport}
          className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/25 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/25 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Importar itens QA
        </button>
      )}
    </div>
  )
}

function TaskDetailModal({ item, onClose }: { item: QAItem; onClose: () => void }) {
  const [showComments, setShowComments] = useState(false)
  const categoryColor = QA_CATEGORY_CONFIG[item.qaCategory]?.color ?? '#6366f1'
  const priorityColor = item.priority === 'Critical' ? '#ef4444'
    : item.priority === 'High' ? '#f97316'
    : item.priority === 'Medium' ? '#f59e0b'
    : item.priority === 'Low' ? '#10b981'
    : '#64748b'
  const usefulComments = (item.comments ?? [])
    .map(comment => ({ ...comment, body: cleanJiraText(comment.body) }))
    .filter(comment => isUsefulJiraComment(comment.body))
  const hiddenComments = Math.max((item.comments?.length ?? 0) - usefulComments.length, 0)
  const previewComment = usefulComments[0]?.body
  const metaCards = [
    { label: 'Cliente',     value: item.client || '-', tone: 'default' },
    { label: 'Sprint',      value: item.sprint || '-', tone: 'default' },
    { label: 'Responsavel', value: item.assignee || '-', tone: 'default' },
    { label: 'Status',      value: item.status || '-', tone: 'category' },
    { label: 'Tipo',        value: item.type || '-', tone: 'default' },
    { label: 'Importado',   value: new Date(item.importedAt).toLocaleString('pt-BR'), tone: 'default' },
    { label: 'Daily',       value: item.sentToDaily ? 'Enviado' : 'Pendente', tone: item.sentToDaily ? 'daily' : 'default' },
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border bg-[#080d18] shadow-2xl"
        style={{
          borderColor: `${categoryColor}66`,
          boxShadow: `0 0 0 1px ${categoryColor}1f, 0 28px 80px rgba(0,0,0,0.55), 0 0 60px ${categoryColor}16`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}66, transparent)` }}
        />
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] bg-white/[0.015] px-5 py-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {item.issueKey && <span className="font-mono text-xs font-bold" style={{ color: categoryColor }}>{item.issueKey}</span>}
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${categoryColor}22`, color: categoryColor }}>{item.qaCategory}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${priorityColor}22`, color: priorityColor }}>{item.priority}</span>
              {item.importDepth === 'deep' && <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">Deep</span>}
            </div>
            <h2 className="text-base font-semibold leading-snug text-white">{item.title}</h2>
          </div>
          <button type="button" aria-label="Fechar" onClick={onClose} className="shrink-0 rounded-lg p-2 text-white/35 hover:bg-white/[0.06] hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {metaCards.map(({ label, value, tone }) => (
              <div
                key={label}
                className="rounded-xl border bg-white/[0.025] p-3"
                style={{
                  borderColor: tone === 'category' ? `${categoryColor}44` : tone === 'daily' ? '#10b98144' : 'rgba(255,255,255,0.07)',
                  background: tone === 'category' ? `${categoryColor}10` : tone === 'daily' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.025)',
                }}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
                <p className="truncate text-sm text-white/70">{value}</p>
              </div>
            ))}
          </div>

          {[
            { label: 'Notas', content: item.notes, icon: FileText },
            { label: 'Descricao Jira', content: item.description, icon: FileText },
          ].filter(s => s.content).map(({ label, content, icon: Icon }) => (
            <section key={label}>
              <h3 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                <Icon className="h-3.5 w-3.5" style={{ color: categoryColor }} />
                {label}
              </h3>
              <div className="rounded-xl border bg-white/[0.025] p-4" style={{ borderColor: `${categoryColor}26` }}>
                <FormattedText text={content ?? ''} />
              </div>
            </section>
          ))}

          {(item.pullRequests?.length ?? 0) > 0 && (
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                <GitPullRequest className="h-3.5 w-3.5 text-primary" />
                Pull Requests
              </h3>
              <div className="space-y-2">
                {item.pullRequests?.map((link, i) => (
                  <a
                    key={`${link.url}-${i}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary/85 transition-colors hover:bg-primary/15 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{link.text || link.url}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {(item.comments?.length ?? 0) > 0 && (
            <section className="rounded-xl border bg-white/[0.018]" style={{ borderColor: `${categoryColor}30` }}>
              <button
                type="button"
                onClick={() => setShowComments(v => !v)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" style={{ color: categoryColor }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Comentarios Jira</span>
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/45">
                      {usefulComments.length} uteis
                    </span>
                    {hiddenComments > 0 && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300/80">
                        {hiddenComments} filtrados
                      </span>
                    )}
                  </div>
                  {!showComments && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/42">
                      {previewComment || 'Sem comentarios relevantes depois da limpeza automatica.'}
                    </p>
                  )}
                </div>
                <ChevronDown className={cn('h-4 w-4 shrink-0 text-white/35 transition-transform', showComments && 'rotate-180')} />
              </button>

              {showComments && (
                <div className="space-y-2 border-t border-white/[0.06] p-3">
                  {usefulComments.length > 0 ? usefulComments.map((comment, i) => (
                    <article key={`${comment.createdAt || 'comment'}-${i}`} className="rounded-xl border border-white/[0.06] bg-[#0d1320] p-3">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-semibold text-white/65">{comment.author || `Comentario ${i + 1}`}</span>
                        {comment.createdAt && <span className="text-white/28">{formatCommentDate(comment.createdAt)}</span>}
                      </div>
                      <FormattedText text={comment.body} />
                    </article>
                  )) : (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-sm text-white/45">
                      Os comentarios importados parecem ser placeholders do Jira, entao foram escondidos.
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
