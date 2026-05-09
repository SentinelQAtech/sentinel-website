'use client'

import { useEffect, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { KanbanCard } from './kanban-card'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import type { KanbanColumnDefinition } from './kanban-types'

interface KanbanColumnProps {
  column: KanbanColumnDefinition
  tasks: Task[]
  count: number
  onAddTask: (status: string) => void
  onOpenTask: (task: Task) => void
  onRenameColumn: (columnId: string, label: string) => void
  onDeleteColumn: (columnId: string) => void
}

export function KanbanColumn({
  column,
  tasks,
  count,
  onAddTask,
  onOpenTask,
  onRenameColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const [isEditing, setIsEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(column.label)

  useEffect(() => {
    setDraftLabel(column.label)
  }, [column.label])

  const saveLabel = () => {
    const nextLabel = draftLabel.trim()
    if (nextLabel) onRenameColumn(column.id, nextLabel)
    else setDraftLabel(column.label)
    setIsEditing(false)
  }

  return (
    <div className="w-72 shrink-0 flex flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex min-w-0 items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          {isEditing ? (
            <input
              autoFocus
              value={draftLabel}
              onChange={e => setDraftLabel(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={e => {
                if (e.key === 'Enter') saveLabel()
                if (e.key === 'Escape') {
                  setDraftLabel(column.label)
                  setIsEditing(false)
                }
              }}
              className="min-w-0 flex-1 rounded-md border border-primary/30 bg-white/[0.06] px-2 py-1 text-sm font-semibold text-white outline-none"
            />
          ) : (
            <button
              type="button"
              title="Editar nome da coluna"
              onDoubleClick={() => setIsEditing(true)}
              className="min-w-0 truncate text-left text-sm font-semibold text-white/80 hover:text-white"
            >
              {column.label}
            </button>
          )}
          <span className="px-1.5 py-0.5 rounded-md bg-white/[0.07] text-xs text-white/40 font-medium">
            {count}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={saveLabel}
                title="Salvar nome"
                className="p-1 rounded-md text-white/30 hover:text-emerald-300 hover:bg-white/[0.06] transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftLabel(column.label)
                  setIsEditing(false)
                }}
                title="Cancelar edição"
                className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Editar nome da coluna"
              className="p-1 rounded-md text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onAddTask(column.id)}
            title={`Adicionar task em ${column.label}`}
            className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteColumn(column.id)}
            title={`Excluir coluna ${column.label}`}
            className="p-1 rounded-md text-white/25 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 flex flex-col gap-2.5 p-2 rounded-xl min-h-[300px] transition-all duration-150',
          isOver
            ? 'bg-primary/[0.06] border border-primary/20'
            : 'bg-white/[0.02] border border-white/[0.04]',
        )}
      >
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} onOpenTask={onOpenTask} />
        ))}

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
              <Plus className="w-4 h-4 text-white/20" />
            </div>
            <p className="text-xs text-white/25">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}
