'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ClipboardCheck, ArrowRight, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQAImporterStore } from '@/store/qa-importer'
import { useQAItems, useImportQAItems, type QAItemInput } from '@/hooks/useQAItems'
import { isQARelated, type ParsedQAItem } from '@/lib/qa-parser'

function toQAItemInput(item: ParsedQAItem): QAItemInput {
  return {
    title: item.title,
    clientName: item.client,
    description: item.description,
    source: 'extension',
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
  }
}

type SyncStatus = 'synced' | 'pending' | 'running'

export function QAQuickAction() {
  const router              = useRouter()
  const { data: items = [] } = useQAItems()
  const qaFilterEnabled     = useQAImporterStore(s => s.qaFilterEnabled)
  const importQAItems       = useImportQAItems()
  const [status, setStatus] = useState<SyncStatus>('synced')
  const [pullMessage, setPullMessage] = useState<string | null>(null)

  const pendingQA  = items.filter(i => !i.sentToDaily && i.qaCategory !== 'Done')
  const criticalQA = items.filter(i => i.priority === 'Critical' && i.qaCategory !== 'Done')

  const handlePull = async () => {
    setStatus('running')
    setPullMessage(null)
    try {
      const res = await fetch('/api/qa-import')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { items: ParsedQAItem[]; count: number }
      const filtered = qaFilterEnabled ? data.items.filter(isQARelated) : data.items
      if (filtered.length > 0) {
        const result = await importQAItems.mutateAsync({ items: filtered.map(toQAItemInput) })
        setPullMessage(`${result.added} novos · ${result.updated} atualizados`)
      } else {
        setPullMessage('Nenhum card pendente')
      }
    } catch {
      setStatus('pending')
      setPullMessage('Falha ao buscar cards')
      return
    }
    setStatus('synced')
  }

  const statusConfig: Record<SyncStatus, { label: string; cls: string; dot: string }> = {
    synced:  { label: 'Synced',  cls: 'text-emerald-400', dot: 'bg-emerald-400'            },
    pending: { label: 'Pending', cls: 'text-amber-400',   dot: 'bg-amber-400'              },
    running: { label: 'Running', cls: 'text-primary',     dot: 'bg-primary animate-pulse'  },
  }
  const sc = statusConfig[status]

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'glass-card relative overflow-hidden rounded-2xl border border-white/[0.07]',
        'bg-gradient-to-br from-white/[0.03] to-transparent',
        'p-5 flex flex-col gap-4'
      )}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 shrink-0">
            <ClipboardCheck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">QA Importer</p>
            <p className="text-xs text-white/40 mt-0.5">Importe e sincronize items do Jira</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={cn('w-1.5 h-1.5 rounded-full', sc.dot)} />
          <span className={cn('text-[11px] font-medium', sc.cls)}>{sc.label}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
          <p className="text-[10px] text-white/30 uppercase tracking-wide mb-0.5">Pendentes</p>
          <p className="text-lg font-bold text-white leading-none">{pendingQA.length}</p>
        </div>
        <div className="rounded-xl bg-red-500/[0.05] border border-red-500/[0.12] px-3 py-2.5">
          <p className="text-[10px] text-red-400/70 uppercase tracking-wide mb-0.5">Críticos</p>
          <p className="text-lg font-bold text-red-400 leading-none">{criticalQA.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <button
          onClick={handlePull}
          disabled={status === 'running'}
          className={cn(
            'flex items-center justify-center gap-2',
            'rounded-xl py-2.5 text-sm font-semibold transition-all duration-200',
            status === 'running'
              ? 'bg-primary/20 text-primary/70 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-600 shadow-[0_0_16px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]'
          )}
        >
          {status === 'running'
            ? <><RefreshCw className="h-4 w-4 animate-spin" /> Buscando...</>
            : <><ClipboardCheck className="h-4 w-4" /> Pull</>
          }
        </button>
        <button
          onClick={() => router.push('/qa-inbox')}
          title="Abrir QA Importer completo"
          className="flex h-full items-center justify-center rounded-xl border border-white/[0.08] px-3 text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {pullMessage && (
        <p className="rounded-lg border border-white/[0.05] bg-white/[0.03] px-3 py-2 text-center text-[11px] text-white/45">
          {pullMessage}
        </p>
      )}
    </motion.div>
  )
}
