import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Priority, BugSeverity, TaskStatus, ProjectStatus, BugStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date utils ────────────────────────────────────────────────────────────────

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  return format(new Date(date), pattern, { locale: ptBR })
}

export function smartDate(date: string | Date): string {
  const d = new Date(date)
  if (isToday(d)) return `Hoje às ${format(d, 'HH:mm')}`
  if (isYesterday(d)) return `Ontem às ${format(d, 'HH:mm')}`
  return format(d, "dd 'de' MMM", { locale: ptBR })
}

// ─── Priority helpers ─────────────────────────────────────────────────────────

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  LOW:      { label: 'Low',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  MEDIUM:   { label: 'Medium',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30'  },
  HIGH:     { label: 'High',     color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30'  },
  CRITICAL: { label: 'Critical', color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'     },
}

export const severityConfig: Record<BugSeverity, { label: string; color: string; bg: string; border: string; dot: string }> = {
  LOW:      { label: 'Low',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  MEDIUM:   { label: 'Medium',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  dot: 'bg-yellow-400'  },
  HIGH:     { label: 'High',     color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  dot: 'bg-orange-400'  },
  CRITICAL: { label: 'Critical', color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     dot: 'bg-red-400'     },
}

export const taskStatusConfig: Record<TaskStatus, { label: string; color: string; bg: string; border: string }> = {
  BACKLOG:     { label: 'Backlog',     color: 'text-slate-400',  bg: 'bg-slate-500/10',  border: 'border-slate-500/30'  },
  TODO:        { label: 'To Do',       color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30'   },
  IN_PROGRESS: { label: 'In Progress', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  QA_TESTING:  { label: 'QA Testing',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30'   },
  REVIEW:      { label: 'Review',      color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30'  },
  DONE:        { label: 'Done',        color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30'},
}

export const bugStatusConfig: Record<BugStatus, { label: string; color: string; bg: string; border: string }> = {
  OPEN:        { label: 'Open',        color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
  IN_PROGRESS: { label: 'In Progress', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  IN_REVIEW:   { label: 'In Review',   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30'  },
  RESOLVED:    { label: 'Resolved',    color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30'},
  CLOSED:      { label: 'Closed',      color: 'text-slate-400',  bg: 'bg-slate-500/10',  border: 'border-slate-500/30'  },
  WONT_FIX:    { label: "Won't Fix",   color: 'text-zinc-400',   bg: 'bg-zinc-500/10',   border: 'border-zinc-500/30'   },
}

export const projectStatusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  ACTIVE:    { label: 'Active',    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  PAUSED:    { label: 'Paused',    color: 'text-yellow-400',  bg: 'bg-yellow-500/10'  },
  COMPLETED: { label: 'Completed', color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  ARCHIVED:  { label: 'Archived',  color: 'text-slate-400',   bg: 'bg-slate-500/10'   },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400',     bg: 'bg-red-500/10'     },
}

// ─── Task title sanitizer ─────────────────────────────────────────────────────

// Cleans titles from Linear exports that contain duplicated/artifact text:
// "[KEY] BODY BODY" → "[KEY] BODY"
// "[KEY] BODY Edit summary for KEY..." → "[KEY] BODY"
export function sanitizeTitle(raw: string): string {
  let s = raw.replace(/\s*Edit summary for [A-Z]{2,}-\d+\b.*/i, '').trim()
  s = s.replace(/^(\[[A-Z]{2,}-\d+\] )(.+?)\2$/, '$1$2').trim()
  return s
}

// ─── Number utils ─────────────────────────────────────────────────────────────

export function abbreviateNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

// ─── Avatar initials ──────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function stringToColor(str: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#a855f7',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
