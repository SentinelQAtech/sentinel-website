'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, GripVertical, MessageSquare, Paperclip } from 'lucide-react'
import { PriorityBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
  onOpenTask?: (task: Task) => void
}

export function KanbanCard({ task, isDragging, onOpenTask }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // isSortableDragging → placeholder na lista (fica semitransparente)
  // isDragging prop    → card dentro do DragOverlay (deve parecer elevado e opaco)
  const isPlaceholder = isSortableDragging && !isDragging

  const storyPointColors: Record<number, string> = {
    1: 'text-emerald-400', 2: 'text-emerald-400', 3: 'text-emerald-400',
    5: 'text-yellow-400', 8: 'text-orange-400', 13: 'text-red-400',
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.closest('a, button, input, textarea, select')) return
    if (!isDragging && !isSortableDragging) onOpenTask?.(task)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        'group relative p-3.5 rounded-xl cursor-grab active:cursor-grabbing',
        'bg-surface-800 border border-white/[0.07]',
        'transition-all duration-150',
        'hover:bg-surface-700 hover:border-white/[0.12] hover:shadow-card',
        isPlaceholder && 'opacity-40 scale-[0.98]',
        isDragging   && 'shadow-2xl shadow-black/40 ring-1 ring-primary/30 scale-[1.02]',
      )}
    >
      {/* Grip indicator — purely visual */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <GripVertical className="w-3 h-3" />
      </div>

      {!isDragging && (
        <div className="absolute right-2 top-2 rounded-md p-1 text-white/20 opacity-0 transition-opacity group-hover:opacity-100">
          <Eye className="w-3.5 h-3.5" />
        </div>
      )}

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
