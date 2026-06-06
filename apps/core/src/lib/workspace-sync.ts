import { useBugsStore } from '@/store/bugs'
import { useSprintsStore } from '@/store/sprints'
import type { QAItem } from '@/store/qa-importer'
import { api } from './api'

export function syncQAItemsToWorkspace(items: QAItem[]) {
  if (items.length === 0) return
  useBugsStore.getState().syncFromQAImporter(items)
  useSprintsStore.getState().upsertFromQAItems(items)

  const seen = new Map<string, string>()
  items.forEach(item => {
    const name = item.project?.trim()
    if (!name) return
    const id = `qa-proj-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    if (!seen.has(id)) seen.set(id, name)
  })

  seen.forEach((name) => {
    api.post('/projects', {
      name,
      description: 'Projeto QA',
      priority: 'MEDIUM',
      tags: [],
    }).catch(() => {
      // project may already exist — ignore
    })
  })
}
