import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  qaSourceId?:  string  // QA Importer item ID origin — tasks with this are removed when QA item is deleted
}

export interface DailyMeeting {
  id:           string
  date?:         string
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

const INITIAL_TASKS: DailyTask[] = []

const INITIAL_MEETINGS: DailyMeeting[] = []

export function getTodayISO() {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10)
}

function withDate<T extends { date?: string }>(items: T[], date: string): T[] {
  return items.map(item => ({ ...item, date: item.date ?? date }))
}

function copyOpenTasks(tasks: DailyTask[], targetDate: string): DailyTask[] {
  return tasks
    .filter(task => task.status !== 'done')
    .map(task => ({
      ...task,
      id: `t${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: targetDate,
      status: 'todo' as DailyStatus,
      notes: task.notes ? `${task.notes}\nCopiada do Daily de ${task.date}.` : `Copiada do Daily de ${task.date}.`,
    }))
}

// ─── Store ────────────────────────────────────────────────────

interface DailyStore {
  tasks:       DailyTask[]
  meetings:    DailyMeeting[]
  allTasks:    DailyTask[]
  allMeetings: DailyMeeting[]
  selectedDate: string

  setSelectedDate: (date: string) => void
  goToToday:       () => void
  getTasksForDate:    (date: string) => DailyTask[]
  getMeetingsForDate: (date: string) => DailyMeeting[]
  getDailyDates:      () => string[]
  copyOpenTasksToToday: (fromDate: string) => number

  addTask:              (task: Omit<DailyTask, 'id'> & { id?: string }) => void
  updateTask:           (id: string, updates: Partial<DailyTask>) => void
  toggleTask:           (id: string) => void
  removeTask:           (id: string) => void
  syncWithQAImporter:   (activeQAIds: Set<string>) => void

  addMeeting:     (m: Omit<DailyMeeting, 'id'>) => void
  removeMeeting:  (id: string) => void

  generateTemplate: () => void
}

export const useDailyStore = create<DailyStore>()(
  persist(
    (set, get) => {
      const today = getTodayISO()
      const initialTasks = withDate(INITIAL_TASKS, today)
      const initialMeetings = withDate(INITIAL_MEETINGS, today)
      const refreshSelected = (date = get().selectedDate) =>
        set(s => ({
          selectedDate: date,
          tasks: s.allTasks.filter(t => (t.date ?? today) === date),
          meetings: s.allMeetings.filter(m => (m.date ?? today) === date).sort((a, b) => a.time.localeCompare(b.time)),
        }))

      return {
      tasks:    initialTasks,
      meetings: initialMeetings,
      allTasks: initialTasks,
      allMeetings: initialMeetings,
      selectedDate: today,

      setSelectedDate: (date) => refreshSelected(date),

      goToToday: () => refreshSelected(getTodayISO()),

      getTasksForDate: (date) => get().allTasks.filter(t => (t.date ?? today) === date),

      getMeetingsForDate: (date) => get().allMeetings.filter(m => (m.date ?? today) === date).sort((a, b) => a.time.localeCompare(b.time)),

      getDailyDates: () => {
        const dates = new Set<string>([getTodayISO()])
        get().allTasks.forEach(t => dates.add(t.date ?? today))
        get().allMeetings.forEach(m => dates.add(m.date ?? today))
        return [...dates].sort((a, b) => b.localeCompare(a))
      },

      copyOpenTasksToToday: (fromDate) => {
        const targetDate = getTodayISO()
        const copies = copyOpenTasks(get().allTasks.filter(t => (t.date ?? today) === fromDate), targetDate)
        if (copies.length === 0) return 0
        set(s => ({ allTasks: [...s.allTasks, ...copies] }))
        refreshSelected(get().selectedDate)
        return copies.length
      },

      addTask: (task) =>
        set(s => {
          const id = task.id ?? `t${Date.now()}`
          // Don't duplicate QA-sourced tasks on the same date
          const taskDate = task.date ?? s.selectedDate
          if (task.qaSourceId && s.allTasks.some(t => t.qaSourceId === task.qaSourceId && (t.date ?? s.selectedDate) === taskDate)) return s
          const datedTask = { ...task, date: task.date ?? s.selectedDate, id }
          const allTasks = [...s.allTasks, datedTask]
          return {
            allTasks,
            tasks: allTasks.filter(t => (t.date ?? today) === s.selectedDate),
          }
        }),

      updateTask: (id, updates) =>
        set(s => {
          const allTasks = s.allTasks.map(t => t.id === id ? { ...t, ...updates } : t)
          return {
            allTasks,
            tasks: allTasks.filter(t => (t.date ?? today) === s.selectedDate),
          }
        }),

      toggleTask: (id) =>
        set(s => {
          const allTasks = s.allTasks.map(t =>
            t.id === id ? { ...t, status: (t.status === 'done' ? 'todo' : 'done') as DailyStatus } : t
          )
          return {
            allTasks,
            tasks: allTasks.filter(t => (t.date ?? today) === s.selectedDate),
          }
        }),

      removeTask: (id) =>
        set(s => {
          const allTasks = s.allTasks.filter(t => t.id !== id)
          return {
            allTasks,
            tasks: allTasks.filter(t => (t.date ?? today) === s.selectedDate),
          }
        }),

      syncWithQAImporter: (activeQAIds) =>
        set(s => {
          // Remove tasks whose QA source item no longer exists in the importer
          const allTasks = s.allTasks.filter(t => !t.qaSourceId || activeQAIds.has(t.qaSourceId))
          return {
            allTasks,
            tasks: allTasks.filter(t => (t.date ?? today) === s.selectedDate),
          }
        }),

      addMeeting: (m) =>
        set(s => {
          const datedMeeting = { ...m, date: m.date ?? s.selectedDate, id: `m${Date.now()}` }
          const allMeetings = [...s.allMeetings, datedMeeting]
          return {
            allMeetings,
            meetings: allMeetings
              .filter(meeting => (meeting.date ?? today) === s.selectedDate)
              .sort((a, b) => a.time.localeCompare(b.time)),
          }
        }),

      removeMeeting: (id) =>
        set(s => {
          const allMeetings = s.allMeetings.filter(m => m.id !== id)
          return {
            allMeetings,
            meetings: allMeetings
              .filter(m => (m.date ?? today) === s.selectedDate)
              .sort((a, b) => a.time.localeCompare(b.time)),
          }
        }),

      generateTemplate: () =>
        set(s => {
          const date = s.selectedDate
          const allTasks = [
            ...s.allTasks.filter(t => (t.date ?? today) !== date),
            ...INITIAL_TASKS.map(t => ({ ...t, id: `${t.id}-${date}`, date, status: 'todo' as DailyStatus })),
          ]
          const allMeetings = [
            ...s.allMeetings.filter(m => (m.date ?? today) !== date),
            ...INITIAL_MEETINGS.map(m => ({ ...m, id: `${m.id}-${date}`, date })),
          ]
          return {
            allTasks,
            allMeetings,
            tasks: allTasks.filter(t => (t.date ?? today) === date),
            meetings: allMeetings.filter(m => (m.date ?? today) === date),
          }
        }),
      }
    },
    {
      name: 'sentinel-core-daily',
      version: 3,
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<DailyStore> | undefined
        const today = getTodayISO()
        const sourceTasks = state?.allTasks ?? state?.tasks ?? INITIAL_TASKS
        const sourceMeetings = state?.allMeetings ?? state?.meetings ?? INITIAL_MEETINGS
        const selectedDate = state?.selectedDate ?? today

        // v3: preserve all existing tasks. syncWithQAImporter handles cleanup of
        // QA-sourced tasks reactively. Manual tasks (no qaSourceId) are never touched.
        const allTasks = withDate(sourceTasks, today)
        const allMeetings = withDate(sourceMeetings, today)
        return {
          ...state,
          selectedDate,
          allTasks,
          allMeetings,
          tasks: allTasks.filter(t => (t.date ?? today) === selectedDate),
          meetings: allMeetings.filter(m => (m.date ?? today) === selectedDate),
        }
      },
    }
  )
)
