'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, ExternalLink, FileSearch } from 'lucide-react'
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-2xl border border-white/[0.08] bg-[#111318] shadow-[0_24px_80px_rgba(0,0,0,0.6)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
                <FileSearch className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                {item.issueKey && (
                  <p className="font-mono text-[11px] font-bold text-white/40 leading-none mb-0.5">
                    {item.issueKey}
                  </p>
                )}
                <Dialog.Title className="text-sm font-semibold text-white/90 leading-snug line-clamp-1">
                  {item.title}
                </Dialog.Title>
              </div>
            </div>
            <Dialog.Close
              className="shrink-0 rounded-lg p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="px-5 space-y-4 pb-5">
            {/* Title full */}
            <div>
              <Label>Título</Label>
              <Field>{item.title}</Field>
            </div>

            {/* Row: categoria + prioridade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria</Label>
                <Field>
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 align-middle"
                    style={{ backgroundColor: cat.color }}
                  />
                  {item.qaCategory}
                </Field>
              </div>
              <div>
                <Label>Prioridade</Label>
                <Field>
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 align-middle"
                    style={{ backgroundColor: prio.color }}
                  />
                  {item.priority}
                </Field>
              </div>
            </div>

            {/* Row: sprint + tipo */}
            <div className="grid grid-cols-2 gap-3">
              {(item.sprint || item.client) && (
                <div>
                  <Label>Sprint / Cliente</Label>
                  <Field>{[item.sprint, item.client].filter(Boolean).join(' · ') || '—'}</Field>
                </div>
              )}
              <div>
                <Label>Tipo detectado</Label>
                <Field>{rank.detectedType ?? item.type ?? '—'}</Field>
              </div>
            </div>

            {/* Row: assignee + análise */}
            <div className="grid grid-cols-2 gap-3">
              {item.assignee && (
                <div>
                  <Label>Responsável</Label>
                  <Field>@{item.assignee}</Field>
                </div>
              )}
              <div>
                <Label>Análise automática</Label>
                <Field>{rank.tag} · ~{rank.estimatedMinutes}min</Field>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Notas</Label>
              {item.notes ? (
                <div className="rounded-xl border border-white/[0.08] bg-[#0d0e13] px-4 py-3 min-h-[72px]">
                  <p className="text-sm text-white/55 leading-relaxed">{item.notes}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/[0.07] bg-[#0d0e13] px-4 py-3 min-h-[56px] flex items-center">
                  <p className="text-xs text-white/25 italic">
                    Sem notas — descrição completa disponível no Jira.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/[0.06]">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors"
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
              <span className="text-xs text-white/20 italic px-4 py-2">Sem link</span>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
      {children}
    </p>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d0e13] px-3.5 py-2.5 text-sm text-white/65">
      {children}
    </div>
  )
}
