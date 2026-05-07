import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────

export type QAPriority   = 'Critical' | 'High' | 'Medium' | 'Low' | 'Unknown'
export type QACategory   = 'Ready for QA' | 'In Testing' | 'Bug Validation' | 'Regression' | 'Review' | 'Blocked' | 'Done' | 'Other'
export type QAItemSource = 'manual' | 'csv' | 'extension'

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
  importedAt:  string     // ISO date string
  sentToDaily: boolean
  qaCategory:  QACategory
}

export interface ImportRecord {
  id:         string
  importedAt: string
  total:      number
  qaCount:    number
  duplicates: number
  source:     QAItemSource
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

const now = new Date().toISOString()

const INITIAL_ITEMS: QAItem[] = [
  {
    id: 'qa-1', source: 'manual',
    issueKey: 'SCRUM-123', title: 'Validate login flow on SmartFlyer',
    client: 'ScrumLaunch', project: 'SmartFlyer',
    status: 'Ready for QA', priority: 'High', sprint: 'Sprint 14',
    assignee: 'Raphael', type: 'QA Testing',
    link: 'https://jira.example.com/browse/SCRUM-123',
    notes: 'Validate login scenarios before release',
    importedAt: now, sentToDaily: false, qaCategory: 'Ready for QA',
  },
  {
    id: 'qa-2', source: 'manual',
    issueKey: 'AMB-442', title: 'Review checkout bug fix',
    client: 'Ambev', project: 'Checkout',
    status: 'In Testing', priority: 'Critical', sprint: 'Sprint 9',
    assignee: 'Raphael', type: 'Bug Validation',
    link: '',
    notes: 'Confirm bug does not reproduce anymore',
    importedAt: now, sentToDaily: false, qaCategory: 'In Testing',
  },
  {
    id: 'qa-3', source: 'manual',
    issueKey: 'SCRUM-124', title: 'Regression test — payment flow',
    client: 'ScrumLaunch', project: 'SmartFlyer',
    status: 'Ready for QA', priority: 'High', sprint: 'Sprint 14',
    assignee: 'Raphael', type: 'Regression',
    link: 'https://jira.example.com/browse/SCRUM-124',
    notes: 'Full regression on checkout after hotfix',
    importedAt: now, sentToDaily: false, qaCategory: 'Regression',
  },
  {
    id: 'qa-4', source: 'manual',
    issueKey: 'UOL-88', title: 'Validar homepage após deploy',
    client: 'UOL', project: 'Portal',
    status: 'Ready for QA', priority: 'Medium', sprint: 'Sprint 15',
    assignee: 'Raphael', type: 'QA Testing',
    link: '',
    notes: 'Smoke test after release',
    importedAt: now, sentToDaily: false, qaCategory: 'Ready for QA',
  },
  {
    id: 'qa-5', source: 'manual',
    issueKey: 'AMB-443', title: 'Validate cart total calculation bug',
    client: 'Ambev', project: 'E-Commerce',
    status: 'Blocked', priority: 'Critical', sprint: 'Sprint 9',
    assignee: 'Raphael', type: 'Bug Validation',
    link: '',
    notes: 'Blocked: waiting for hotfix from dev team',
    importedAt: now, sentToDaily: false, qaCategory: 'Blocked',
  },
  {
    id: 'qa-6', source: 'manual',
    issueKey: 'CON-77', title: 'Review API endpoint tests',
    client: 'Concepta', project: 'API Gateway',
    status: 'In Review', priority: 'High', sprint: 'Sprint 14',
    assignee: 'Raphael', type: 'Review',
    link: '',
    notes: '',
    importedAt: now, sentToDaily: false, qaCategory: 'Review',
  },
]

// ─── Store ────────────────────────────────────────────────────

type ImportInput = Omit<QAItem, 'id' | 'importedAt' | 'sentToDaily'>

interface ImportResult {
  added:      number
  updated:    number
  total:      number
  skipped:    number
}

interface QAImporterStore {
  items:           QAItem[]
  history:         ImportRecord[]
  qaFilterEnabled: boolean

  importItems:    (raw: ImportInput[], source: QAItemSource) => ImportResult
  updateItem:     (id: string, updates: Partial<QAItem>) => void
  removeItem:     (id: string) => void
  markSentToDaily:(ids: string[]) => void
  sendAllToDaily: () => string[]  // returns ids of items marked

  setQaFilter:    (enabled: boolean) => void
  clearAll:       () => void

  // Extension-ready payload handler — accepts external Jira-like data
  handleQaImportPayload: (payload: Partial<ImportInput>[], source: QAItemSource) => ImportResult
}

export const useQAImporterStore = create<QAImporterStore>()(
  persist(
    (set, get) => ({
      items:           INITIAL_ITEMS,
      history:         [],
      qaFilterEnabled: true,

      importItems: (raw, source) => {
        const ts = new Date().toISOString()
        let added = 0, updated = 0

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
              updated++
            } else {
              next.push({ ...incoming, id: `qa-${Date.now()}-${added}`, source, importedAt: ts, sentToDaily: false })
              added++
            }
          })

          const record: ImportRecord = {
            id:         `imp-${Date.now()}`,
            importedAt: ts,
            total:      raw.length,
            qaCount:    raw.length,  // caller pre-filters
            duplicates: updated,
            source,
          }

          return {
            items:   next,
            history: [record, ...state.history].slice(0, 20),
          }
        })

        return { added, updated, total: raw.length, skipped: 0 }
      },

      updateItem: (id, updates) =>
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...updates } : i) })),

      removeItem: (id) =>
        set(s => ({ items: s.items.filter(i => i.id !== id) })),

      markSentToDaily: (ids) =>
        set(s => ({
          items: s.items.map(i => ids.includes(i.id) ? { ...i, sentToDaily: true } : i),
        })),

      sendAllToDaily: () => {
        const notSent = get().items.filter(i => !i.sentToDaily).map(i => i.id)
        set(s => ({
          items: s.items.map(i => ({ ...i, sentToDaily: true })),
        }))
        return notSent
      },

      setQaFilter: (enabled) => set({ qaFilterEnabled: enabled }),

      clearAll: () => set({ items: [] }),

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
          source:     source,
          qaCategory: p.qaCategory ?? 'Other',
        }))
        return get().importItems(normalized, source)
      },
    }),
    { name: 'spm-qa-importer' }
  )
)
