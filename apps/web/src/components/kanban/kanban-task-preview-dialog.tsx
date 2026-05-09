'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { PriorityBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types'
import type { KanbanColumnDefinition } from './kanban-types'

interface KanbanTaskPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  columns: KanbanColumnDefinition[]
}

export function KanbanTaskPreviewDialog({
  open,
  onOpenChange,
  task,
  columns,
}: KanbanTaskPreviewDialogProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    if (!open) setIsFullScreen(false)
  }, [open])

  if (!task) return null

  const status = columns.find(col => col.id === task.status)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className={isFullScreen
            ? 'w-full h-full overflow-y-auto bg-surface-900 border border-white/[0.08] p-8 shadow-2xl animate-fade-in'
            : 'w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-900 border border-white/[0.08] rounded-2xl p-6 shadow-2xl animate-fade-in'
          }>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-semibold text-white leading-snug">
                  {task.title}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-white/35 mt-1">
                  Task {task.id}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/30">Status</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/75">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: status?.color ?? '#64748b' }}
                  />
                  {status?.label ?? task.status}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/30">Prioridade</p>
                <div className="mt-2">
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/30">Story Points</p>
                <p className="mt-2 text-sm text-white/75">{task.storyPoints ? `${task.storyPoints}p` : 'Sem estimativa'}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-white/40 uppercase tracking-wide">Descricao</p>
                <p className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-sm leading-relaxed text-white/65">
                  {task.description || 'Nenhuma descricao cadastrada para esta task.'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-white/40 uppercase tracking-wide">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {task.tags.length > 0 ? task.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-white/[0.06] text-xs text-white/45 border border-white/[0.06]">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-sm text-white/30">Sem tags</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm">
                  Fechar
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                variant="glow"
                size="sm"
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => setIsFullScreen(true)}
              >
                Abrir tela inteira
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
