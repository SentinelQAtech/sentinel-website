import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EventType   = 'meeting' | 'sprint' | 'deadline' | 'review' | 'other'
export type EventRegion = 'india' | 'usa' | 'brazil' | 'ukraine'

export interface CalendarEvent {
  id:           string
  title:        string
  date:         string       // YYYY-MM-DD
  startTime:    string       // HH:MM
  endTime:      string       // HH:MM
  type:         EventType
  region?:      EventRegion
  participants?: string[]
  description?: string
}

export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string }> = {
  meeting:  { label: 'Meeting',  color: '#06b6d4' },
  sprint:   { label: 'Sprint',   color: '#8b5cf6' },
  deadline: { label: 'Deadline', color: '#ef4444' },
  review:   { label: 'Review',   color: '#10b981' },
  other:    { label: 'Other',    color: '#f59e0b' },
}

export const REGION_CONFIG: Record<EventRegion, { label: string; flag: string }> = {
  india:   { label: 'Índia',   flag: '🇮🇳' },
  usa:     { label: 'EUA',     flag: '🇺🇸' },
  brazil:  { label: 'Brasil',  flag: '🇧🇷' },
  ukraine: { label: 'Ucrânia', flag: '🇺🇦' },
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'ce1',  title: 'Sprint 14 Planning',         date: '2026-05-04', startTime: '09:00', endTime: '11:00', type: 'sprint'   },
  { id: 'ce2',  title: 'Daily India — ABinBev',       date: '2026-05-06', startTime: '06:00', endTime: '06:30', type: 'meeting', region: 'india'   },
  { id: 'ce3',  title: 'Daily EUA — Concepta',        date: '2026-05-06', startTime: '09:00', endTime: '09:30', type: 'meeting', region: 'usa'     },
  { id: 'ce4',  title: 'PR Review — Auth Module',     date: '2026-05-07', startTime: '15:00', endTime: '16:00', type: 'review'  },
  { id: 'ce5',  title: 'Daily Brasil — ScrumLaunch',  date: '2026-05-07', startTime: '10:00', endTime: '10:30', type: 'meeting', region: 'brazil'  },
  { id: 'ce6',  title: 'Daily Ucrânia — ScrumLaunch', date: '2026-05-08', startTime: '11:00', endTime: '11:30', type: 'meeting', region: 'ukraine' },
  { id: 'ce7',  title: 'Code Review — API Gateway',   date: '2026-05-12', startTime: '11:00', endTime: '12:30', type: 'review'  },
  { id: 'ce8',  title: 'E-Commerce Deadline',         date: '2026-05-15', startTime: '18:00', endTime: '18:00', type: 'deadline' },
  { id: 'ce9',  title: 'Sprint 14 Review',            date: '2026-05-18', startTime: '14:00', endTime: '16:00', type: 'sprint'  },
  { id: 'ce10', title: 'Sprint 14 Retrospective',     date: '2026-05-19', startTime: '16:00', endTime: '17:00', type: 'sprint'  },
  { id: 'ce11', title: 'Mobile App v2.0 Release',     date: '2026-05-22', startTime: '10:00', endTime: '12:00', type: 'deadline' },
  { id: 'ce12', title: 'Team Monthly Review',         date: '2026-05-28', startTime: '14:00', endTime: '15:30', type: 'meeting' },
  { id: 'ce13', title: 'Sprint 15 Planning',          date: '2026-06-01', startTime: '09:00', endTime: '11:00', type: 'sprint'  },
]

interface CalendarStore {
  events:        CalendarEvent[]
  addEvent:      (event: Omit<CalendarEvent, 'id'>) => void
  removeEvent:   (id: string) => void
  updateEvent:   (id: string, updates: Partial<CalendarEvent>) => void
  getEventsForDate: (date: string) => CalendarEvent[]
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: INITIAL_EVENTS,

      addEvent: (event) => set(s => ({
        events: [...s.events, { ...event, id: `ce${Date.now()}` }],
      })),

      removeEvent: (id) => set(s => ({
        events: s.events.filter(e => e.id !== id),
      })),

      updateEvent: (id, updates) => set(s => ({
        events: s.events.map(e => e.id === id ? { ...e, ...updates } : e),
      })),

      getEventsForDate: (date) =>
        get().events
          .filter(e => e.date === date)
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }),
    { name: 'sentinel-core-calendar' }
  )
)
