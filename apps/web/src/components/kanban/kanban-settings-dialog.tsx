'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { KanbanColumnDefinition } from './kanban-types'

interface KanbanSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: KanbanColumnDefinition[]
  onRenameColumn: (columnId: string, label: string) => void
  onAddColumn: () => void
}

export function KanbanSettingsDialog({
  open,
  onOpenChange,
  columns,
  onRenameColumn,
  onAddColumn,
}: KanbanSettingsDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface-900 border border-white/[0.08] rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <Dialog.Title className="text-base font-semibold text-white">Board Settings</Dialog.Title>
                <Dialog.Description className="text-xs text-white/35 mt-0.5">
                  Configure as colunas do Kanban Board
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wide">Colunas</p>
                <div className="space-y-1.5">
                  {columns.map(col => (
                    <div
                      key={col.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: col.color }}
                      />
                      <input
                        value={col.label}
                        onChange={e => onRenameColumn(col.id, e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-sm text-white/75 outline-none placeholder:text-white/20"
                        placeholder="Nome da coluna"
                      />
                      {col.isDefault && (
                        <span className="text-[10px] text-white/20 font-mono">{col.id}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={onAddColumn}
              >
                Adicionar coluna
              </Button>
            </div>

            <Dialog.Close asChild>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Fechar
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
