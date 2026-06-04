import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SprintStatus } from '@/types'
import type { QAItem } from './qa-importer'

export interface Sprint {
  id:         string
  name:       string
  goal?:      string
  status:     SprintStatus
  startDate:  string
  endDate:    string
  capacity?:  number
  projectId?: string
  createdAt:  string
  updatedAt:  string
}

interface SprintsState {
  sprints: Sprint[]
  addSprint:          (data: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => Sprint
  updateSprint:       (id: string, updates: Partial<Sprint>) => void
  deleteSprint:       (id: string) => void
  upsertFromQAItems:  (items: QAItem[]) => void
}

export const useSprintsStore = create<SprintsState>()(
  persist(
    (set) => ({
      sprints: [],

      addSprint: (data) => {
        const now = new Date().toISOString()
        const sprint: Sprint = { ...data, id: `sprint-${Date.now()}`, createdAt: now, updatedAt: now }
        set(s => ({ sprints: [sprint, ...s.sprints] }))
        return sprint
      },

      updateSprint: (id, updates) =>
        set(s => ({
          sprints: s.sprints.map(sp =>
            sp.id === id ? { ...sp, ...updates, updatedAt: new Date().toISOString() } : sp
          ),
        })),

      deleteSprint: (id) =>
        set(s => ({ sprints: s.sprints.filter(sp => sp.id !== id) })),

      upsertFromQAItems: (items) =>
        set(s => {
          const now       = new Date().toISOString()
          const today     = now.slice(0, 10)
          const endDate   = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
          const existing  = new Set(s.sprints.map(sp => sp.name.toLowerCase()))
          const toAdd: Sprint[] = []

          const uniqueNames = [...new Set(
            items.map(i => i.sprint).filter((n): n is string => !!n?.trim())
          )]

          uniqueNames.forEach(name => {
            if (existing.has(name.toLowerCase())) return
            existing.add(name.toLowerCase())
            toAdd.push({
              id:        `sprint-qa-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              name,
              status:    'ACTIVE',
              startDate: today,
              endDate,
              createdAt: now,
              updatedAt: now,
            })
          })

          if (toAdd.length === 0) return s
          return { sprints: [...toAdd, ...s.sprints] }
        }),
    }),
    { name: 'sentinel-core-sprints', version: 1 }
  )
)
