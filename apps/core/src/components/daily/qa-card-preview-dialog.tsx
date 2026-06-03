'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, ExternalLink, Clock, Tag, Users, Layers, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QA_CATEGORY_CONFIG, PRIORITY_CONFIG, type QAItem } from '@/store/qa-importer'
import { rankItem } from '@/lib/qa-ranking'

interface Props {
  item: QAItem | null
  onClose: () => void
}

export function QACardPreviewDialog({ item, onClose }: Props) {
  if (!item) return null

  const rank    = rankItem(item)
  const cat     = QA_CATEGORY_CONFIG[item.qaCategory]
  const prio    = PRIORITY_CONFIG[item.priority]

  return (
    <Dialog.Root open={!!item} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
            'rounded-2xl border border-white/[0.09] bg-[#0e0f14] shadow-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {item.issueKey && (
                <span className="font-mono text-[11px] font-bold text-white/50 bg-white/[0.07] px-2 py-0.5 rounded-md shrink-0">
                  {item.issueKey}
                </span>
              )}
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color + '22', color: cat.color }}
              >
                {item.qaCategory}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: prio.color + '20', color: prio.color }}
              >
                {item.priority}
              </span>
              {rank.detectedType && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 shrink-0">
                  {rank.detectedType}
                </span>
              )}
            </div>

            <Dialog.Close
              className="shrink-0 rounded-lg p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Title */}
          <div className="px-5 py-4">
            <Dialog.Title className="text-base font-semibold leading-snug text-white">
              {item.title}
            </Dialog.Title>
          </div>

          {/* Metadata grid */}
          <div className="px-5 pb-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {item.sprint && (
              <MetaField icon={<Clock className="h-3.5 w-3.5" />} label="Sprint" value={item.sprint} />
            )}
            {item.assignee && (
              <MetaField icon={<Users className="h-3.5 w-3.5" />} label="Assignee" value={`@${item.assignee}`} />
            )}
            {item.client && (
              <MetaField icon={<Layers className="h-3.5 w-3.5" />} label="Cliente" value={item.client} />
            )}
            {item.type && (
              <MetaField icon={<Tag className="h-3.5 w-3.5" />} label="Tipo" value={item.type} />
            )}
            <MetaField
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Análise"
              value={`${rank.tag} · ~${rank.estimatedMinutes}min`}
            />
          </div>

          {/* Notes */}
          <div className="px-5 pb-4">
            {item.notes ? (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/25 mb-2">Notas</p>
                <p className="text-sm text-white/60 leading-relaxed">{item.notes}</p>
              </div>
            ) : (
              <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/[0.07] px-4 py-3 text-center">
                <p className="text-xs text-white/25">
                  Sem notas importadas — a descrição completa está no Jira.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/[0.06]">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Fechar
              </button>
            </Dialog.Close>

            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no Jira
              </a>
            ) : (
              <span className="text-xs text-white/20 italic">Sem link disponível</span>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function MetaField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-white/25 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25">{label}</p>
        <p className="text-xs text-white/65 truncate">{value}</p>
      </div>
    </div>
  )
}
