import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KanbanColumnDefinition } from '@/components/kanban/kanban-types'

// Column IDs match QACategory values so drag-and-drop directly updates qaCategory
export const INITIAL_KANBAN_COLUMNS: KanbanColumnDefinition[] = [
  { id: 'Ready for QA',   label: 'Ready for QA',   color: '#6366f1', isDefault: true },
  { id: 'In Testing',     label: 'In Testing',      color: '#06b6d4', isDefault: true },
  { id: 'Bug Validation', label: 'Bug Validation',  color: '#ef4444', isDefault: true },
  { id: 'Regression',     label: 'Regression',      color: '#f97316', isDefault: true },
  { id: 'Review',         label: 'Review',          color: '#10b981', isDefault: true },
  { id: 'Blocked',        label: 'Blocked',         color: '#f59e0b', isDefault: true },
  { id: 'Done',           label: 'Done',            color: '#64748b', isDefault: true },
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
