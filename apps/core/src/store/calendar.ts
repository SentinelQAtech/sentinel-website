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

const INITIAL_EVENTS: CalendarEvent[] = []

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
