import { useBugsStore } from '@/store/bugs'
import { useSprintsStore } from '@/store/sprints'
import { useProjectsStore } from '@/store/projects'
import type { QAItem } from '@/store/qa-importer'

export function syncQAItemsToWorkspace(items: QAItem[]) {
  if (items.length === 0) return
  useBugsStore.getState().syncFromQAImporter(items)
  useSprintsStore.getState().upsertFromQAItems(items)
  useProjectsStore.getState().syncFromQAImporter(items)
}
