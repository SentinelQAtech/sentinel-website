import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────

export type DailyPriority = 'Critical' | 'High' | 'Medium' | 'Low'
export type DailyStatus   = 'todo' | 'in_progress' | 'done' | 'blocked'
export type DailyType     = 'Daily' | 'Card Work' | 'Study' | 'Testing' | 'QA Planning' | 'Review' | 'Planning' | 'Personal' | 'Meeting'

export interface DailyTask {
  id:          string
  client:      string
  title:       string
  type:        DailyType
  priority:    DailyPriority
  status:      DailyStatus
  responsible?: string
  notes?:      string
}

export interface DailyMeeting {
  id:           string
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

// ─── Initial data ─────────────────────────────────────────────

const INITIAL_TASKS: DailyTask[] = [
  { id: 't1',  client: 'UOL',         title: 'Fazer Daily',                                            type: 'Daily',       priority: 'Medium', status: 'todo' },
  { id: 't2',  client: 'Concepta',    title: 'Fazer 8 horas em card',                                  type: 'Card Work',   priority: 'High',   status: 'todo' },
  { id: 't3',  client: 'ScrumLaunch', title: 'Fazer Daily SmartFlyler',                                type: 'Daily',       priority: 'Medium', status: 'todo' },
  { id: 't4',  client: 'ScrumLaunch', title: 'Fazer estudos sobre SmartFlyger',                        type: 'Study',       priority: 'Medium', status: 'todo' },
  { id: 't5',  client: 'ScrumLaunch', title: 'Fazer testes na plataforma se possível',                 type: 'Testing',     priority: 'Low',    status: 'todo' },
  { id: 't6',  client: 'ScrumLaunch', title: 'Fazer planejamento de QA para o Motta para sexta-feira', type: 'QA Planning', priority: 'High',   status: 'todo' },
  { id: 't7',  client: 'Ambev',       title: 'Conversar com Shrest para saber prioridades do dia',     type: 'Daily',       priority: 'High',   status: 'todo' },
  { id: 't8',  client: 'Ambev',       title: 'Fazer review',                                           type: 'Review',      priority: 'Medium', status: 'todo' },
  { id: 't9',  client: 'Ambev',       title: 'Fazer Planning',                                         type: 'Planning',    priority: 'Medium', status: 'todo' },
  { id: 't10', client: 'Pessoal',     title: 'Nada',                                                   type: 'Personal',    priority: 'Low',    status: 'done' },
]

const INITIAL_MEETINGS: DailyMeeting[] = [
  { id: 'm1', region: 'India',   time: '09:00' },
  { id: 'm2', region: 'India',   time: '10:00' },
  { id: 'm3', region: 'India',   time: '15:00' },
  { id: 'm4', region: 'EUA',     time: '10:00' },
  { id: 'm5', region: 'EUA',     time: '10:30' },
  { id: 'm6', region: 'EUA',     time: '10:45' },
  { id: 'm7', region: 'Brasil',  time: '09:30' },
  { id: 'm8', region: 'Ucrânia', time: '10:30' },
]

// ─── Store ────────────────────────────────────────────────────

interface DailyStore {
  tasks:    DailyTask[]
  meetings: DailyMeeting[]

  addTask:        (task: Omit<DailyTask, 'id'>) => void
  updateTask:     (id: string, updates: Partial<DailyTask>) => void
  toggleTask:     (id: string) => void
  removeTask:     (id: string) => void

  addMeeting:     (m: Omit<DailyMeeting, 'id'>) => void
  removeMeeting:  (id: string) => void

  generateTemplate: () => void
}

export const useDailyStore = create<DailyStore>()(
  persist(
    (set) => ({
      tasks:    INITIAL_TASKS,
      meetings: INITIAL_MEETINGS,

      addTask: (task) =>
        set(s => ({ tasks: [...s.tasks, { ...task, id: `t${Date.now()}` }] })),

      updateTask: (id, updates) =>
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),

      toggleTask: (id) =>
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
          ),
        })),

      removeTask: (id) =>
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      addMeeting: (m) =>
        set(s => ({
          meetings: [...s.meetings, { ...m, id: `m${Date.now()}` }]
            .sort((a, b) => a.time.localeCompare(b.time)),
        })),

      removeMeeting: (id) =>
        set(s => ({ meetings: s.meetings.filter(m => m.id !== id) })),

      generateTemplate: () =>
        set({
          tasks:    INITIAL_TASKS.map(t => ({ ...t, status: 'todo' as DailyStatus })),
          meetings: INITIAL_MEETINGS,
        }),
    }),
    { name: 'spm-daily' }
  )
)
