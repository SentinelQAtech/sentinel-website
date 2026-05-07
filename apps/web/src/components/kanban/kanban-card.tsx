'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MessageSquare, Paperclip } from 'lucide-react'
import { PriorityBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
}

export function KanbanCard({ task, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isBeingDragged = isDragging || isSortableDragging

  const storyPointColors: Record<number, string> = {
    1: 'text-emerald-400', 2: 'text-emerald-400', 3: 'text-emerald-400',
    5: 'text-yellow-400', 8: 'text-orange-400', 13: 'text-red-400',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative p-3.5 rounded-xl cursor-grab active:cursor-grabbing',
        'bg-surface-800 border border-white/[0.07]',
        'transition-all duration-150',
        'hover:bg-surface-700 hover:border-white/[0.12] hover:shadow-card',
        isBeingDragged
          ? 'opacity-50 ring-2 ring-primary/40 scale-[1.02] shadow-glow-sm'
          : '',
      )}
    >
      {/* Drag handle — visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-3 h-3 text-white/30" />
      </div>

      <div className="space-y-2.5 ml-2">
        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.06] text-white/35 border border-white/[0.06]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <p className="text-sm text-white/85 leading-snug">{task.title}</p>

        {/* Priority + Points */}
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {task.storyPoints && (
            <span className={cn('text-xs font-bold tabular-nums', storyPointColors[task.storyPoints] ?? 'text-white/50')}>
              {task.storyPoints}p
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2.5 text-xs text-white/30">
            {(task.comments?.length ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {task.comments?.length}
              </span>
            )}
            {(task.attachments?.length ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                {task.attachments?.length}
              </span>
            )}
          </div>
          {task.assignee && (
            <Avatar user={task.assignee} size="xs" />
          )}
        </div>
      </div>
    </div>
  )
}
