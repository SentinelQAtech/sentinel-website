import { cn } from '@/lib/utils'
import type { Priority, BugSeverity, TaskStatus, BugStatus } from '@/types'
import { priorityConfig, severityConfig, taskStatusConfig, bugStatusConfig } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium',
        variant === 'default' && 'bg-white/10 text-white/80',
        variant === 'outline' && 'border border-white/20 text-white/70',
        variant === 'ghost' && 'text-white/60',
        className
      )}
    >
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color, cfg.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.color.replace('text-', 'bg-'))} />
      {cfg.label}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: BugSeverity }) {
  const cfg = severityConfig[severity]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color, cfg.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const cfg = taskStatusConfig[status]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color, cfg.border)}>
      {cfg.label}
    </span>
  )
}

export function BugStatusBadge({ status }: { status: BugStatus }) {
  const cfg = bugStatusConfig[status]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color, cfg.border)}>
      {cfg.label}
    </span>
  )
}
