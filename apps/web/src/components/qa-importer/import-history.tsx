'use client'

import { Clock, FileText, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImportRecord } from '@/store/qa-importer'

interface Props { history: ImportRecord[] }

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function ImportHistory({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="w-6 h-6 text-white/15 mx-auto mb-2" />
        <p className="text-xs text-white/25">Nenhuma importação ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.slice(0, 8).map(rec => (
        <div
          key={rec.id}
          className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-100"
        >
          <div className="mt-0.5 text-white/30">
            {rec.source === 'csv'
              ? <Table2 className="w-3.5 h-3.5" />
              : <FileText className="w-3.5 h-3.5" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded',
                rec.source === 'csv'
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'bg-violet-500/15 text-violet-400'
              )}>
                {rec.source === 'csv' ? 'CSV' : 'Texto'}
              </span>
              <span className="text-[10px] text-white/25 shrink-0">{relTime(rec.importedAt)}</span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-[10px]">
              <span className="text-white/50">
                <span className="font-semibold text-white/70">{rec.qaCount}</span> QA items
              </span>
              {rec.duplicates > 0 && (
                <span className="text-amber-400/70">
                  {rec.duplicates} atualizados
                </span>
              )}
              <span className="text-white/25">{rec.total} total</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
