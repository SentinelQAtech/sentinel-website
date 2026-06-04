import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SprintStatus } from '@/types'

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
  addSprint:      (data: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => Sprint
  updateSprint:   (id: string, updates: Partial<Sprint>) => void
  deleteSprint:   (id: string) => void
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
    }),
    { name: 'sentinel-core-sprints', version: 1 }
  )
)
