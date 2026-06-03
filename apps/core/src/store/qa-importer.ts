import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncQAItemsToWorkspace } from '@/lib/workspace-sync'
import { generateQAResolutionReport } from '@/lib/qa-resolution-report'
import { createUserWorkspaceStorage } from '@/lib/workspace-storage'

// ─── Types ────────────────────────────────────────────────────

export type QAPriority   = 'Critical' | 'High' | 'Medium' | 'Low' | 'Unknown'
export type QACategory   = 'Ready for QA' | 'In Testing' | 'Bug Validation' | 'Regression' | 'Review' | 'Blocked' | 'Done' | 'Other'
export type QAItemSource = 'manual' | 'csv' | 'extension'
export type QAResolutionResult = 'PASS' | 'FAIL' | 'PARTIAL' | 'BLOCKED'
export type QADailyStatus = 'todo' | 'doing' | 'done' | 'blocked'
export type QAImportDepth = 'board' | 'deep'

export interface QALink {
  url: string
  text?: string
}

export interface QAComment {
  body: string
  author?: string
  createdAt?: string
}

export interface QAResolution {
  result:           QAResolutionResult
  coreObjective:    string
  coreFlow:         string
  secondaryFlows:   string
  visualValidation: string
  regressionRisk:   string
  validatedItems:   string
  failedItems:      string
  observedBehavior: string
  evidence:         string
  environment:      string
  browser:          string
  buildVersion:     string
  report:           string
  resolvedAt:       string
}

export interface QAItem {
  id:          string
  source:      QAItemSource
  issueKey:    string
  title:       string
  client:      string
  project?:    string
  status:      string
  priority:    QAPriority
  sprint?:     string
  assignee?:   string
  type:        string
  link?:       string
  notes?:      string
  description?: string
  comments?:   QAComment[]
  devNotes?:   string
  pullRequests?: QALink[]
  externalLinks?: QALink[]
  lastSyncedAt?: string
  importDepth?: QAImportDepth
  deepImportError?: string
  importedAt:  string
  sentToDaily: boolean
  qaCategory:  QACategory
  resolution?: QAResolution
  dailyStatus?: QADailyStatus
  dailyOrder?: number
  dailyDate?: string
  sentToDailyAt?: string
}

export interface ImportRecord {
  id:         string
  importedAt: string
  total:      number
  qaCount:    number
  duplicates: number
  source:     QAItemSource
}

export interface ArchivedSessionCounts {
  total:   number
  pass:    number
  fail:    number
  partial: number
  blocked: number
  pending: number
}

export interface ArchivedSession {
  id:         string
  archivedAt: string
  sprint:     string | null
  client:     string | null
  counts:     ArchivedSessionCounts
  items:      QAItem[]
}

export const PRIORITY_ORDER: Record<QAPriority, number> = {
  Critical: 0, High: 1, Medium: 2, Low: 3, Unknown: 4,
}

export const QA_CATEGORY_CONFIG: Record<QACategory, { color: string; bg: string }> = {
  'Ready for QA':  { color: '#6366f1', bg: 'bg-indigo-500/20'  },
  'In Testing':    { color: '#06b6d4', bg: 'bg-cyan-500/20'    },
  'Bug Validation':{ color: '#ef4444', bg: 'bg-red-500/20'     },
  'Regression':    { color: '#f97316', bg: 'bg-orange-500/20'  },
  'Review':        { color: '#10b981', bg: 'bg-emerald-500/20' },
  'Blocked':       { color: '#f59e0b', bg: 'bg-amber-500/20'   },
  'Done':          { color: '#64748b', bg: 'bg-slate-500/20'   },
  'Other':         { color: '#8b5cf6', bg: 'bg-violet-500/20'  },
}

export const PRIORITY_CONFIG: Record<QAPriority, { color: string; label: string }> = {
  Critical: { color: '#ef4444', label: 'Critical' },
  High:     { color: '#f97316', label: 'High'     },
  Medium:   { color: '#f59e0b', label: 'Medium'   },
  Low:      { color: '#10b981', label: 'Low'       },
  Unknown:  { color: '#64748b', label: 'Unknown'  },
}

// ─── Initial data ─────────────────────────────────────────────

const INITIAL_ITEMS: QAItem[] = []

function getLocalISODate() {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10)
}

function normalizeLinks(value: unknown): QALink[] {
  if (!Array.isArray(value)) return []
  return value
    .map(link => {
      if (typeof link === 'string') return { url: link }
      if (!link || typeof link !== 'object') return null
      const candidate = link as Partial<QALink>
      if (!candidate.url) return null
      return { url: candidate.url, text: candidate.text ?? '' }
    })
    .filter((link): link is QALink => Boolean(link))
}

function normalizeComments(value: unknown): QAComment[] {
  if (!Array.isArray(value)) return []
  const comments: Array<QAComment | null> = value.map(comment => {
    if (typeof comment === 'string') return { body: comment }
    if (!comment || typeof comment !== 'object') return null
    const candidate = comment as Partial<QAComment>
    if (!candidate.body) return null
    return {
      body: candidate.body,
      author: candidate.author ?? '',
      createdAt: candidate.createdAt ?? '',
    }
  })
  return comments.filter((comment): comment is QAComment => Boolean(comment))
}

// ─── Store ────────────────────────────────────────────────────

type ImportInput = Omit<QAItem, 'id' | 'importedAt' | 'sentToDaily'>

interface ImportResult {
  added:      number
  updated:    number
  total:      number
  skipped:    number
}

interface QAImporterStore {
  items:            QAItem[]
  history:          ImportRecord[]
  qaFilterEnabled:  boolean
  archivedSessions: ArchivedSession[]
  prefixMap:        Record<string, string>  // e.g. { SFC: 'ScrumLaunch', UOL: 'UOL' }

  importItems:      (raw: ImportInput[], source: QAItemSource) => ImportResult
  updateItem:       (id: string, updates: Partial<QAItem>) => void
  removeItem:       (id: string) => void
  markSentToDaily:  (ids: string[]) => void
  updateDailyState: (id: string, updates: Pick<Partial<QAItem>, 'dailyStatus' | 'dailyOrder' | 'dailyDate'>) => void
  moveDailyItem:    (id: string, direction: 'up' | 'down') => void
  saveResolution:   (id: string, resolution: Omit<QAResolution, 'report' | 'resolvedAt'>) => void
  sendAllToDaily:   () => string[]
  archiveAndClear:  () => void
  setPrefixMap:     (map: Record<string, string>) => void

  setQaFilter:    (enabled: boolean) => void
  clearAll:       () => void

  handleQaImportPayload: (payload: Partial<ImportInput>[], source: QAItemSource) => ImportResult
}

export const useQAImporterStore = create<QAImporterStore>()(
  persist(
    (set, get) => ({
      items:            INITIAL_ITEMS,
      history:          [],
      qaFilterEnabled:  true,
      archivedSessions: [],
      prefixMap:        {},

      importItems: (raw, source) => {
        const ts = new Date().toISOString()
        let added = 0, updated = 0
        const syncedItems: QAItem[] = []

        set(state => {
          const next = [...state.items]

          raw.forEach(incoming => {
            const dupeIdx = incoming.issueKey
              ? next.findIndex(x => x.issueKey && x.issueKey.toUpperCase() === incoming.issueKey.toUpperCase())
              : next.findIndex(x =>
                  x.title.toLowerCase() === incoming.title.toLowerCase() &&
                  x.client === incoming.client &&
                  x.sprint === incoming.sprint
                )

            if (dupeIdx >= 0) {
              next[dupeIdx] = { ...next[dupeIdx], ...incoming, importedAt: ts }
              syncedItems.push(next[dupeIdx])
              updated++
            } else {
              const created = { ...incoming, id: `qa-${Date.now()}-${added}-${Math.random().toString(36).slice(2, 7)}`, source, importedAt: ts, sentToDaily: false }
              next.push(created)
              syncedItems.push(created)
              added++
            }
          })

          const record: ImportRecord = {
            id:         `imp-${Date.now()}`,
            importedAt: ts,
            total:      raw.length,
            qaCount:    raw.length,
            duplicates: updated,
            source,
          }

          return {
            items:   next,
            history: [record, ...state.history].slice(0, 20),
          }
        })

        syncQAItemsToWorkspace(syncedItems)
        return { added, updated, total: raw.length, skipped: 0 }
      },

      updateItem: (id, updates) =>
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...updates } : i) })),

      removeItem: (id) =>
        set(s => ({ items: s.items.filter(i => i.id !== id) })),

      markSentToDaily: (ids) =>
        set(s => {
          const today = getLocalISODate()
          const currentOrders = s.items
            .filter(i => i.sentToDaily && (i.dailyDate ?? today) === today)
            .map(i => i.dailyOrder ?? 0)
          let nextOrder = currentOrders.length > 0 ? Math.max(...currentOrders) + 1 : 0

          return {
            items: s.items.map(i => {
              if (!ids.includes(i.id)) return i
              if (i.sentToDaily) return i
              return {
                ...i,
                sentToDaily: true,
                sentToDailyAt: new Date().toISOString(),
                dailyDate: today,
                dailyStatus: 'todo' as QADailyStatus,
                dailyOrder: nextOrder++,
              }
            }),
          }
        }),

      updateDailyState: (id, updates) =>
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...updates } : i) })),

      moveDailyItem: (id, direction) =>
        set(s => {
          const item = s.items.find(i => i.id === id)
          if (!item) return s
          const date = item.dailyDate ?? getLocalISODate()
          const ordered = s.items
            .filter(i => i.sentToDaily && (i.dailyDate ?? date) === date)
            .sort((a, b) => (a.dailyOrder ?? 0) - (b.dailyOrder ?? 0))
          const index = ordered.findIndex(i => i.id === id)
          const targetIndex = direction === 'up' ? index - 1 : index + 1
          if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return s

          const nextOrdered = [...ordered]
          const [moved] = nextOrdered.splice(index, 1)
          nextOrdered.splice(targetIndex, 0, moved)
          const orderById = new Map(nextOrdered.map((qaItem, order) => [qaItem.id, order]))

          return {
            items: s.items.map(i => orderById.has(i.id) ? { ...i, dailyOrder: orderById.get(i.id) } : i),
          }
        }),

      saveResolution: (id, resolutionInput) => {
        let synced: QAItem | null = null
        set(s => {
          const items = s.items.map(item => {
            if (item.id !== id) return item

            const nextCategory: QACategory =
              resolutionInput.result === 'PASS' ? 'Done' :
              resolutionInput.result === 'FAIL' ? 'Bug Validation' :
              'Blocked'
            const nextDailyStatus: QADailyStatus =
              resolutionInput.result === 'PASS' ? 'done' : 'blocked'

            const baseResolution = {
              ...resolutionInput,
              resolvedAt: new Date().toISOString(),
              report: '',
            }
            const nextItem: QAItem = {
              ...item,
              qaCategory: nextCategory,
              status: nextCategory,
              dailyStatus: nextDailyStatus,
              resolution: {
                ...baseResolution,
                report: generateQAResolutionReport({ ...item, qaCategory: nextCategory, status: nextCategory }, baseResolution),
              },
            }
            synced = nextItem
            return nextItem
          })
          return { items }
        })
        if (synced) syncQAItemsToWorkspace([synced])
      },

      sendAllToDaily: () => {
        const notSent = get().items.filter(i => !i.sentToDaily).map(i => i.id)
        const today = getLocalISODate()
        set(s => ({
          items: s.items.map(i => i.sentToDaily ? i : {
            ...i,
            sentToDaily: true,
            sentToDailyAt: new Date().toISOString(),
            dailyDate: today,
            dailyStatus: 'todo' as QADailyStatus,
          }),
        }))
        return notSent
      },

      archiveAndClear: () => set(s => {
        if (s.items.length === 0) return s

        const sprints = [...new Set(s.items.map(i => i.sprint).filter(Boolean))]
        const clients = [...new Set(s.items.map(i => i.client).filter(Boolean))]

        const counts: ArchivedSessionCounts = {
          total:   s.items.length,
          pass:    s.items.filter(i => i.resolution?.result === 'PASS').length,
          fail:    s.items.filter(i => i.resolution?.result === 'FAIL').length,
          partial: s.items.filter(i => i.resolution?.result === 'PARTIAL').length,
          blocked: s.items.filter(i => i.resolution?.result === 'BLOCKED' || (!i.resolution && i.qaCategory === 'Blocked')).length,
          pending: s.items.filter(i => !i.resolution && i.qaCategory !== 'Done' && i.qaCategory !== 'Blocked').length,
        }

        const session: ArchivedSession = {
          id:         `session-${Date.now()}`,
          archivedAt: new Date().toISOString(),
          sprint:     sprints[0] ?? null,
          client:     clients[0] ?? null,
          counts,
          items:      s.items,
        }

        return {
          items:            [],
          archivedSessions: [session, ...s.archivedSessions].slice(0, 30),
        }
      }),

      setPrefixMap: (map) => set({ prefixMap: map }),

      setQaFilter: (enabled) => set({ qaFilterEnabled: enabled }),

      clearAll: () => set({ items: [], history: [] }),

      handleQaImportPayload: (payload, source) => {
        const normalized: ImportInput[] = payload.map(p => ({
          issueKey:   p.issueKey   ?? '',
          title:      p.title      ?? 'Untitled',
          client:     p.client     ?? '',
          project:    p.project    ?? '',
          status:     p.status     ?? '',
          priority:   p.priority   ?? 'Unknown',
          sprint:     p.sprint     ?? '',
          assignee:   p.assignee   ?? '',
          type:       p.type       ?? '',
          link:       p.link       ?? '',
          notes:      p.notes      ?? '',
          description: p.description ?? '',
          comments:    normalizeComments(p.comments),
          devNotes:    p.devNotes ?? '',
          pullRequests: normalizeLinks(p.pullRequests),
          externalLinks: normalizeLinks(p.externalLinks),
          lastSyncedAt: p.lastSyncedAt ?? '',
          importDepth:  p.importDepth ?? 'board',
          deepImportError: p.deepImportError ?? '',
          source:     source,
          qaCategory: p.qaCategory ?? 'Other',
        }))
        return get().importItems(normalized, source)
      },
    }),
    {
      name: 'sentinel-core-qa-importer',
      version: 3,
      storage: createUserWorkspaceStorage(),
      migrate: (state: unknown) => {
        const s = (state ?? {}) as Record<string, unknown>
        return {
          items:            Array.isArray(s.items) ? s.items : [],
          history:          Array.isArray(s.history) ? s.history : [],
          qaFilterEnabled:  typeof s.qaFilterEnabled === 'boolean' ? s.qaFilterEnabled : true,
          archivedSessions: Array.isArray(s.archivedSessions) ? s.archivedSessions : [],
          prefixMap:        (s.prefixMap && typeof s.prefixMap === 'object' && !Array.isArray(s.prefixMap)) ? s.prefixMap as Record<string, string> : {},
        }
      },
    }
  )
)
