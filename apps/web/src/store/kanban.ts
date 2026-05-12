import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus, Priority } from '@/types'
import type { KanbanColumnDefinition, NewKanbanTask } from '@/components/kanban/kanban-types'
import type { QAItem, QAPriority } from './qa-importer'

export const INITIAL_KANBAN_COLUMNS: KanbanColumnDefinition[] = [
  { id: 'BACKLOG',     label: 'Backlog',     color: '#475569', isDefault: true },
  { id: 'TODO',        label: 'To Do',       color: '#3b82f6', isDefault: true },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#8b5cf6', isDefault: true },
  { id: 'QA_TESTING',  label: 'QA Testing',  color: '#06b6d4', isDefault: true },
  { id: 'REVIEW',      label: 'Review',      color: '#f59e0b', isDefault: true },
  { id: 'DONE',        label: 'Done',        color: '#10b981', isDefault: true },
]

const DEFAULT_CREATOR = {
  id: '1',
  email: '',
  username: '',
  name: 'Raphael',
  role: 'ADMIN' as const,
  isActive: true,
  createdAt: '',
}

type StateSetter<T> = T | ((current: T) => T)

interface KanbanState {
  columns: KanbanColumnDefinition[]
  tasks: Task[]
  setColumns: (next: StateSetter<KanbanColumnDefinition[]>) => void
  setTasks: (next: StateSetter<Task[]>) => void
  addTask: (data: NewKanbanTask) => void
  importQAItems: (items: QAItem[]) => void
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      columns: INITIAL_KANBAN_COLUMNS,
      tasks: [],

      setColumns: (next) =>
        set(state => ({ columns: typeof next === 'function' ? next(state.columns) : next })),

      setTasks: (next) =>
        set(state => ({ tasks: typeof next === 'function' ? next(state.tasks) : next })),

      addTask: (data) => {
        const colTasks = get().tasks.filter(task => task.status === data.status)
        const task: Task = {
          id: `t${Date.now()}`,
          title: data.title,
          status: data.status as TaskStatus,
          priority: data.priority,
          tags: data.tags,
          storyPoints: data.storyPoints,
          projectId: 'manual-project',
          creatorId: DEFAULT_CREATOR.id,
          creator: DEFAULT_CREATOR,
          order: colTasks.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({ tasks: [...state.tasks, task] }))
      },

      importQAItems: (items) =>
        set(state => {
          const next = [...state.tasks]
          items.forEach(item => {
            const id = `qa-${item.id}`
            const status = mapQAStatusToTaskStatus(item)
            const existingIndex = next.findIndex(task => task.id === id)
            const existingColumnCount = next.filter(task => task.status === status).length
            const task: Task = {
              id,
              title: item.issueKey ? `${item.issueKey} - ${item.title}` : item.title,
              description: [item.notes, item.link].filter(Boolean).join('\n') || undefined,
              status,
              priority: mapQAPriorityToPriority(item.priority),
              storyPoints: mapQAPriorityToPoints(item.priority),
              order: existingIndex >= 0 ? next[existingIndex].order : existingColumnCount,
              tags: [item.client, item.sprint, item.qaCategory, item.source].filter(Boolean) as string[],
              projectId: item.project || item.client || 'qa-import',
              sprintId: item.sprint,
              creatorId: DEFAULT_CREATOR.id,
              creator: DEFAULT_CREATOR,
              createdAt: existingIndex >= 0 ? next[existingIndex].createdAt : item.importedAt,
              updatedAt: new Date().toISOString(),
            }
            if (existingIndex >= 0) next[existingIndex] = { ...next[existingIndex], ...task }
            else next.push(task)
          })
          return { tasks: next }
        }),
    }),
    { name: 'sentinel-core-kanban', version: 1 }
  )
)

function mapQAStatusToTaskStatus(item: QAItem): TaskStatus {
  if (item.qaCategory === 'Done' || item.status.toLowerCase().includes('done')) return 'DONE'
  if (item.qaCategory === 'Review' || item.status.toLowerCase().includes('review')) return 'REVIEW'
  if (
    item.qaCategory === 'Ready for QA' ||
    item.qaCategory === 'In Testing' ||
    item.qaCategory === 'Bug Validation' ||
    item.qaCategory === 'Regression'
  ) return 'QA_TESTING'
  if (item.qaCategory === 'Blocked') return 'TODO'
  return 'TODO'
}

function mapQAPriorityToPriority(priority: QAPriority): Priority {
  if (priority === 'Critical') return 'CRITICAL'
  if (priority === 'High') return 'HIGH'
  if (priority === 'Low') return 'LOW'
  return 'MEDIUM'
}

function mapQAPriorityToPoints(priority: QAPriority) {
  if (priority === 'Critical') return 8
  if (priority === 'High') return 5
  if (priority === 'Medium') return 3
  if (priority === 'Low') return 1
  return undefined
}
