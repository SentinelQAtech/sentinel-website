import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KanbanColumnDefinition } from '@/components/kanban/kanban-types'

// Column IDs match QAItem.workflowState values so drag-and-drop persists to backend.
export const INITIAL_KANBAN_COLUMNS: KanbanColumnDefinition[] = [
  { id: 'inbox',      label: 'Inbox',       color: '#6366f1', isDefault: true },
  { id: 'planned',    label: 'Planned',     color: '#8b5cf6', isDefault: true },
  { id: 'in_testing', label: 'In Testing',  color: '#06b6d4', isDefault: true },
  { id: 'review',     label: 'Review',      color: '#10b981', isDefault: true },
  { id: 'blocked',    label: 'Blocked',     color: '#f59e0b', isDefault: true },
  { id: 'done',       label: 'Done',        color: '#64748b', isDefault: true },
]

type StateSetter<T> = T | ((current: T) => T)

interface KanbanState {
  columns: KanbanColumnDefinition[]
  setColumns: (next: StateSetter<KanbanColumnDefinition[]>) => void
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      columns: INITIAL_KANBAN_COLUMNS,
      setColumns: (next) =>
        set(state => ({ columns: typeof next === 'function' ? next(state.columns) : next })),
    }),
    {
      name: 'sentinel-core-kanban',
      version: 2,
      migrate: () => ({ columns: INITIAL_KANBAN_COLUMNS }),
    }
  )
)
