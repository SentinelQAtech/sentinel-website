import { useBugsStore } from '@/store/bugs'
import { useSprintsStore } from '@/store/sprints'
import type { QAItem } from '@/store/qa-importer'
import { api } from './api'

export function syncQAItemsToWorkspace(items: QAItem[]) {
  if (items.length === 0) return

  // Persist bugs to the server via API (primary path)
  api.post('/bugs/bulk-sync', {
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      priority: item.priority,
      status: item.status,
      qaCategory: item.qaCategory,
      client: item.client,
      project: item.project,
      sprint: item.sprint,
      source: item.source,
      issueKey: item.issueKey,
      notes: item.notes,
      description: item.description,
      link: item.link,
      pullRequests: item.pullRequests,
      externalLinks: item.externalLinks,
      comments: item.comments,
      importedAt: item.importedAt,
    })),
  }).catch(() => {
    // API may not be available — fall back to local store
  })

  // Local store (legacy — consumers will migrate to React Query)
  useBugsStore.getState().syncFromQAImporter(items)
  // DEPRECATED: upsertFromQAItems uses the deprecated sprints zustand store.
  // When the QA Importer is migrated to API calls, replace this with a call
  // to the sprints API (POST /sprints) for each new sprint name.
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
