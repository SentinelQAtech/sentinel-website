import { useBugsStore } from '@/store/bugs'
import { useKanbanStore } from '@/store/kanban'
import type { QAItem } from '@/store/qa-importer'

export function syncQAItemsToWorkspace(items: QAItem[]) {
  if (items.length === 0) return
  useKanbanStore.getState().importQAItems(items)
  useBugsStore.getState().importQAItems(items)
}
