'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ClipboardCheck, ArrowRight, RefreshCw, CheckCircle2,
  Clock, History, Layers, AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQAImporterStore } from '@/store/qa-importer'
import type { QAItemSource } from '@/store/qa-importer'

function formatRelativeTime(isoDate: string): string {
  const diff  = Date.now() - new Date(isoDate).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)   return 'agora mesmo'
  if (mins < 60)  return `${mins} min atrás`
  if (hours < 24) return `${hours}h atrás`
  return `${days}d atrás`
}

const SOURCE_LABEL: Record<QAItemSource, { label: string; cls: string }> = {
  extension: { label: 'Ext',    cls: 'bg-violet-500/20 text-violet-400 border-violet-500/25' },
  csv:       { label: 'CSV',    cls: 'bg-blue-500/20   text-blue-400   border-blue-500/25'   },
  manual:    { label: 'Manual', cls: 'bg-white/[0.06]  text-white/40   border-white/[0.08]'  },
}

type SyncStatus = 'synced' | 'pending' | 'running'

export function QAQuickAction() {
  const router              = useRouter()
  const { items, history }  = useQAImporterStore()
  const [status, setStatus] = useState<SyncStatus>('synced')

  const lastSync   = history[0]
  const pendingQA  = items.filter(i => !i.sentToDaily && i.qaCategory !== 'Done')
  const criticalQA = items.filter(i => i.priority === 'Critical' && i.qaCategory !== 'Done')

  const handlePull = async () => {
    setStatus('running')
    await new Promise(r => setTimeout(r, 600))
    setStatus('synced')
    router.push('/qa-importer')
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

      {/* Last sync */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-white/30">
          {lastSync
            ? <><Clock className="h-3 w-3" /><span className="text-xs">Last sync: {formatRelativeTime(lastSync.importedAt)}</span></>
            : <><CheckCircle2 className="h-3 w-3" /><span className="text-xs">Nenhum sync realizado</span></>
          }
        </div>
        {lastSync && (
          <span className="text-[10px] text-white/20 font-mono">+{lastSync.total} items</span>
        )}
      </div>

      {/* Pull button */}
      <button
        onClick={handlePull}
        disabled={status === 'running'}
        className={cn(
          'w-full flex items-center justify-center gap-2',
          'rounded-xl py-2.5 text-sm font-semibold transition-all duration-200',
          status === 'running'
            ? 'bg-primary/20 text-primary/70 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-600 shadow-[0_0_16px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]'
        )}
      >
        {status === 'running'
          ? <><RefreshCw className="h-4 w-4 animate-spin" /> Abrindo...</>
          : <><ClipboardCheck className="h-4 w-4" /> Pull <ArrowRight className="h-3.5 w-3.5 ml-0.5" /></>
        }
      </button>

      {/* Import history */}
      {history.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <History className="h-3 w-3 text-white/20" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
              Histórico recente
            </p>
          </div>
          <div className="space-y-1.5">
            {history.slice(0, 3).map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn(
                    'shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border',
                    SOURCE_LABEL[record.source].cls
                  )}>
                    {SOURCE_LABEL[record.source].label}
                  </span>
                  <span className="text-[11px] text-white/35 truncate">
                    {formatRelativeTime(record.importedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[11px]">
                  <span className="flex items-center gap-1 text-white/50">
                    <Layers className="h-2.5 w-2.5" />
                    {record.total}
                  </span>
                  {record.duplicates > 0 && (
                    <span className="flex items-center gap-1 text-amber-400/60">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      {record.duplicates}
                    </span>
                  )}
                  {record.qaCount > 0 && (
                    <span className="text-primary/60 font-medium">{record.qaCount} QA</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 py-2 text-white/20">
          <History className="h-4 w-4" />
          <p className="text-[10px]">Nenhum histórico ainda</p>
        </div>
      )}
    </motion.div>
  )
}
