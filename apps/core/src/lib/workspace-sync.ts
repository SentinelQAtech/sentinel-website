import { useBugsStore } from '@/store/bugs'
import type { QAItem } from '@/store/qa-importer'

// Board now reads directly from useQAImporterStore — no sync needed
export function syncQAItemsToWorkspace(items: QAItem[]) {
  if (items.length === 0) return
  useBugsStore.getState().syncFromQAImporter(items)
}
