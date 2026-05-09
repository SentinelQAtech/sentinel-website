'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Task, TaskStatus, Priority } from '@/types'

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'LOW',      label: 'Low' },
  { value: 'MEDIUM',   label: 'Medium' },
  { value: 'HIGH',     label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
]

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'BACKLOG',     label: 'Backlog' },
  { value: 'TODO',        label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'QA_TESTING',  label: 'QA Testing' },
  { value: 'REVIEW',      label: 'Review' },
  { value: 'DONE',        label: 'Done' },
]

const POINT_OPTIONS = [1, 2, 3, 5, 8, 13]

interface KanbanTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStatus?: TaskStatus
  onAdd: (task: Pick<Task, 'title' | 'status' | 'priority' | 'tags' | 'storyPoints'>) => void
}

export function KanbanTaskDialog({
  open,
  onOpenChange,
  defaultStatus = 'TODO',
  onAdd,
}: KanbanTaskDialogProps) {
  const [title, setTitle]       = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [status, setStatus]     = useState<TaskStatus>(defaultStatus)
  const [tagsInput, setTagsInput] = useState('')
  const [points, setPoints]     = useState<number | ''>('')

  // Sync default status when dialog opens for a specific column
  useEffect(() => {
    if (open) setStatus(defaultStatus)
  }, [open, defaultStatus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title:       title.trim(),
      status,
      priority,
      tags:        tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      storyPoints: points !== '' ? Number(points) : undefined,
    })
    // Reset
    setTitle('')
    setPriority('MEDIUM')
    setTagsInput('')
    setPoints('')
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-surface-900 border border-white/[0.08] rounded-2xl p-6 shadow-2xl animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white">Nova Task</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Título *</label>
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Descreva a task..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Prioridade</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags + Story Points */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">
                  Tags <span className="text-white/25">(vírgula)</span>
                </label>
                <input
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="frontend, bug..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Story Points</label>
                <select
                  value={points}
                  onChange={e => setPoints(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="">—</option>
                  {POINT_OPTIONS.map(p => (
                    <option key={p} value={p}>{p}p</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm" className="flex-1">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                variant="glow"
                size="sm"
                className="flex-1"
                disabled={!title.trim()}
              >
                Criar Task
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
