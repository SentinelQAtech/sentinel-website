import type { Task } from '@/types'

export interface KanbanColumnDefinition {
  id: string
  label: string
  color: string
  isDefault?: boolean
}

export type NewKanbanTask = Pick<Task, 'title' | 'priority' | 'tags' | 'storyPoints'> & {
  status: string
}
