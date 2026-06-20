// Daily domain types + presentation config.
//
// NOTE: Daily data is no longer stored in localStorage. Tasks live as QA items
// (sentToDaily) via the API (see `@/hooks/useDaily` / `@/hooks/useQAItems`) and
// meetings live in the `daily_meetings` table (see `@/hooks/useDaily`). This
// module now only exports shared types and presentation constants.

// ─── Types ────────────────────────────────────────────────────

export type DailyPriority = 'Critical' | 'High' | 'Medium' | 'Low'
export type DailyStatus   = 'todo' | 'in_progress' | 'done' | 'blocked'
export type DailyType     = 'Daily' | 'Card Work' | 'Study' | 'Testing' | 'QA Planning' | 'Review' | 'Planning' | 'Personal' | 'Meeting'

export interface DailyTask {
  id:           string
  date?:        string
  client:       string
  title:        string
  type:         DailyType
  priority:     DailyPriority
  status:       DailyStatus
  responsible?: string
  notes?:       string
  qaSourceId?:  string
}

export interface DailyMeeting {
  id:           string
  date?:        string
  region:       string
  time:         string
  title?:       string
  participants?: string
  notes?:       string
}

// ─── Config ───────────────────────────────────────────────────

export const CLIENT_CONFIG: Record<string, { color: string; short: string }> = {
  'UOL':         { color: '#ef4444', short: 'UOL' },
  'Concepta':    { color: '#3b82f6', short: 'CON' },
  'ScrumLaunch': { color: '#06b6d4', short: 'SCR' },
  'Ambev':       { color: '#f59e0b', short: 'AMB' },
  'Pessoal':     { color: '#8b5cf6', short: 'PES' },
}

export const REGION_CONFIG: Record<string, { flag: string; color: string }> = {
  'India':    { flag: '🇮🇳', color: '#f59e0b' },
  'EUA':      { flag: '🇺🇸', color: '#3b82f6' },
  'Brasil':   { flag: '🇧🇷', color: '#10b981' },
  'Ucrânia':  { flag: '🇺🇦', color: '#06b6d4' },
}

export const PRIORITY_CONFIG: Record<DailyPriority, { color: string; bg: string; border: string; label: string }> = {
  Critical: { color: '#ef4444', bg: 'bg-red-500/15',    border: 'border-red-500/30',    label: 'Crítico' },
  High:     { color: '#f97316', bg: 'bg-orange-500/15', border: 'border-orange-500/30', label: 'Alto'    },
  Medium:   { color: '#f59e0b', bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  label: 'Médio'   },
  Low:      { color: '#10b981', bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',label: 'Baixo'   },
}

export const TYPE_CONFIG: Record<DailyType, { color: string }> = {
  'Daily':      { color: '#6366f1' },
  'Card Work':  { color: '#3b82f6' },
  'Study':      { color: '#8b5cf6' },
  'Testing':    { color: '#06b6d4' },
  'QA Planning':{ color: '#f59e0b' },
  'Review':     { color: '#10b981' },
  'Planning':   { color: '#ec4899' },
  'Personal':   { color: '#64748b' },
  'Meeting':    { color: '#f97316' },
}

export const STATUS_CONFIG: Record<DailyStatus, { label: string; color: string }> = {
  todo:        { label: 'A Fazer',    color: '#64748b' },
  in_progress: { label: 'Em Andamento', color: '#6366f1' },
  done:        { label: 'Concluído',  color: '#10b981' },
  blocked:     { label: 'Bloqueado',  color: '#ef4444' },
}

export const DEFAULT_CLIENTS  = ['UOL', 'Concepta', 'ScrumLaunch', 'Ambev', 'Pessoal']
export const DEFAULT_REGIONS  = ['India', 'EUA', 'Brasil', 'Ucrânia']
export const TASK_TYPES: DailyType[] = ['Daily', 'Card Work', 'Study', 'Testing', 'QA Planning', 'Review', 'Planning', 'Personal', 'Meeting']
export const PRIORITIES: DailyPriority[] = ['Critical', 'High', 'Medium', 'Low']
export const STATUSES: DailyStatus[] = ['todo', 'in_progress', 'done', 'blocked']

// ─── Helpers ──────────────────────────────────────────────────

export function getTodayISO() {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10)
}
