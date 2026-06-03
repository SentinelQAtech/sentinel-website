'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QA_CATEGORY_CONFIG, PRIORITY_CONFIG, type QAItem } from '@/store/qa-importer'
import { rankItem } from '@/lib/qa-ranking'

interface Props {
  item: QAItem | null
  onClose: () => void
}

export function QACardPreviewDialog({ item, onClose }: Props) {
  if (!item) return null

  const rank = rankItem(item)
  const cat  = QA_CATEGORY_CONFIG[item.qaCategory]
  const prio = PRIORITY_CONFIG[item.priority]

  return (
    <Dialog.Root open={!!item} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2',
            'rounded-2xl border border-white/[0.09] bg-[#1c1f2a] shadow-[0_32px_96px_rgba(0,0,0,0.6)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
          )}
        >
          {/* Close */}
          <Dialog.Close
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          {/* Hero — issue key centralizado */}
          <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6">
            {item.issueKey ? (
              <span className="font-mono text-3xl font-bold tracking-tight text-white">
                {item.issueKey}
              </span>
            ) : (
              <span className="font-mono text-2xl font-bold text-white/40">QA</span>
            )}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <Badge color={cat.color}>{item.qaCategory}</Badge>
              <Badge color={prio.color}>{item.priority}</Badge>
              {rank.detectedType && (
                <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-white/45">
                  {rank.detectedType}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-white/[0.07]" />

          {/* Fields */}
          <div className="px-5 py-5 space-y-4">
            {/* Título */}
            <div>
              <Label>Título</Label>
              <Field>{item.title}</Field>
            </div>

            {/* Sprint + Cliente */}
            {(item.sprint || item.client) && (
              <div className={cn('grid gap-3', item.sprint && item.client ? 'grid-cols-2' : 'grid-cols-1')}>
                {item.sprint && (
                  <div>
                    <Label>Sprint</Label>
                    <Field>{item.sprint}</Field>
                  </div>
                )}
                {item.client && (
                  <div>
                    <Label>Cliente</Label>
                    <Field>{item.client}</Field>
                  </div>
                )}
              </div>
            )}

            {/* Assignee + Tipo */}
            {(item.assignee || rank.detectedType) && (
              <div className="grid grid-cols-2 gap-3">
                {item.assignee && (
                  <div>
                    <Label>Responsável</Label>
                    <Field>@{item.assignee}</Field>
                  </div>
                )}
                {rank.detectedType && (
                  <div>
                    <Label>Tipo</Label>
                    <Field>{rank.detectedType}</Field>
                  </div>
                )}
              </div>
            )}

            {/* Análise */}
            <div>
              <Label>Análise automática</Label>
              <Field>{rank.tag} · ~{rank.estimatedMinutes}min</Field>
            </div>

            {/* Notas */}
            <div>
              <Label>Notas</Label>
              <div className={cn(
                'min-h-[72px] rounded-xl border border-white/[0.08] bg-[#14161e] px-4 py-3',
                !item.notes && 'flex items-center',
              )}>
                {item.notes
                  ? <p className="text-sm text-white/60 leading-relaxed">{item.notes}</p>
                  : <p className="text-sm text-white/25 italic">Sem notas — descrição completa no Jira.</p>
                }
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/[0.07]">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-3 py-2 text-sm text-white/35 hover:text-white/65 transition-colors"
              >
                Cancelar
              </button>
            </Dialog.Close>

            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/85 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no Jira
              </a>
            ) : (
              <span className="text-xs text-white/20 italic">Sem link</span>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
      {children}
    </p>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[40px] items-center rounded-xl border border-white/[0.08] bg-[#14161e] px-3.5 py-2.5 text-sm text-white/65">
      {children}
    </div>
  )
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: color + '25', color }}
    >
      {children}
    </span>
  )
}
