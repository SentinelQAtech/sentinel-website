import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'
import { TEAM, TEAM_STORAGE_KEY, type TeamMember } from '@/lib/team-data'

interface TeamState {
  members: TeamMember[]
  addMember:     (member: TeamMember) => void
  updateMember:  (id: string, updates: Partial<TeamMember>) => void
  offboardMember:(id: string) => void
  setMembers:    (members: TeamMember[]) => void
}

// Custom storage adapter — reads/writes raw JSON array so team page (which
// also writes to this key manually) stays compatible without changes.
const arrayStorage = {
  getItem: (name: string): StorageValue<{ members: TeamMember[] }> | null => {
    try {
      const raw = localStorage.getItem(name)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      // Team page saves a plain array; Zustand saves {state,version}
      const members: TeamMember[] = Array.isArray(parsed) ? parsed : (parsed?.state?.members ?? null)
      if (!members) return null
      return { state: { members }, version: 0 }
    } catch { return null }
  },
  setItem: (name: string, value: StorageValue<{ members: TeamMember[] }>) => {
    localStorage.setItem(name, JSON.stringify(value.state.members))
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: TEAM,

      setMembers: (members) => set({ members }),

      addMember: (member) =>
        set(s => ({ members: [...s.members, member] })),

      updateMember: (id, updates) =>
        set(s => ({
          members: s.members.map(m => m.user.id === id ? { ...m, ...updates } : m),
        })),

      offboardMember: (id) =>
        set(s => ({
          members: s.members.map(m =>
            m.user.id === id
              ? { ...m, user: { ...m.user, isActive: false }, offboardedAt: new Date().toISOString() }
              : m
          ),
        })),
    }),
    {
      name: TEAM_STORAGE_KEY,
      storage: arrayStorage,
    }
  )
)
