'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { KanbanCard } from './kanban-card'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'

interface KanbanColumnProps {
  column: { id: TaskStatus; label: string; color: string }
  tasks: Task[]
  count: number
  onAddTask: (status: TaskStatus) => void
}

export function KanbanColumn({ column, tasks, count, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="w-72 shrink-0 flex flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-sm font-semibold text-white/80">{column.label}</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/[0.07] text-xs text-white/40 font-medium">
            {count}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          title={`Adicionar task em ${column.label}`}
          className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
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
          <KanbanCard key={task.id} task={task} />
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
