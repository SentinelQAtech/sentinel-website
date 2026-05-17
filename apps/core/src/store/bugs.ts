import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Bug, BugSeverity, BugStatus, Priority, Project, User } from '@/types'
import type { QAItem, QAPriority } from './qa-importer'

const defaultReporter: User = {
  id: '1',
  email: 'raphael@sentinel.tech',
  username: 'raphacastilho',
  name: 'Raphael Castilho',
  role: 'ADMIN',
  isActive: true,
  createdAt: new Date().toISOString(),
}

const defaultProject: Project = {
  id: 'manual-project',
  name: 'Manual Intake',
  description: '',
  status: 'ACTIVE',
  priority: 'MEDIUM',
  progress: 0,
  tags: [],
  coverColor: '#6366f1',
  ownerId: defaultReporter.id,
  owner: defaultReporter,
  members: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

interface BugsState {
  bugs: Bug[]
  addBug: (bug: Bug) => void
  importQAItems: (items: QAItem[]) => void
}

export const useBugsStore = create<BugsState>()(
  persist(
    (set) => ({
      bugs: [],

      addBug: (bug) =>
        set(state => ({ bugs: [bug, ...state.bugs.filter(item => item.id !== bug.id)] })),

      importQAItems: (items) =>
        set(state => {
          const next = [...state.bugs]
          items.filter(isBugItem).forEach(item => {
            const id = `qa-bug-${item.id}`
            const existingIndex = next.findIndex(bug => bug.id === id)
            const bug: Bug = {
              id,
              bugId: item.issueKey || `BUG-${String(next.length + 1).padStart(3, '0')}`,
              title: item.title,
              description: item.notes || item.link || 'Bug importado via QA Importer.',
              severity: mapQAPriorityToSeverity(item.priority),
              priority: mapQAPriorityToPriority(item.priority),
              status: mapQAStatusToBugStatus(item),
              environment: item.project || item.client || undefined,
              tags: [item.client, item.sprint, item.qaCategory, item.source].filter(Boolean) as string[],
              projectId: item.project || item.client || defaultProject.id,
              reporterId: defaultReporter.id,
              reporter: defaultReporter,
              project: {
                ...defaultProject,
                id: item.project || item.client || defaultProject.id,
                name: item.project || item.client || defaultProject.name,
              },
              createdAt: existingIndex >= 0 ? next[existingIndex].createdAt : item.importedAt,
              updatedAt: new Date().toISOString(),
              resolvedAt: item.qaCategory === 'Done' ? new Date().toISOString() : undefined,
            }
            if (existingIndex >= 0) next[existingIndex] = { ...next[existingIndex], ...bug }
            else next.unshift(bug)
          })
          return { bugs: next }
        }),
    }),
    { name: 'sentinel-core-bugs', version: 1 }
  )
)

function isBugItem(item: QAItem) {
  const text = `${item.issueKey} ${item.title} ${item.type} ${item.status} ${item.qaCategory}`.toLowerCase()
  return item.qaCategory === 'Bug Validation' || text.includes('bug') || text.includes('defect')
}

function mapQAPriorityToSeverity(priority: QAPriority): BugSeverity {
  if (priority === 'Critical') return 'CRITICAL'
  if (priority === 'High') return 'HIGH'
  if (priority === 'Low') return 'LOW'
  return 'MEDIUM'
}

function mapQAPriorityToPriority(priority: QAPriority): Priority {
  if (priority === 'Critical') return 'CRITICAL'
  if (priority === 'High') return 'HIGH'
  if (priority === 'Low') return 'LOW'
  return 'MEDIUM'
}

function mapQAStatusToBugStatus(item: QAItem): BugStatus {
  const status = item.status.toLowerCase()
  if (item.qaCategory === 'Done' || status.includes('done') || status.includes('closed')) return 'RESOLVED'
  if (item.qaCategory === 'Review' || status.includes('review')) return 'IN_REVIEW'
  if (item.qaCategory === 'In Testing' || status.includes('progress') || status.includes('testing')) return 'IN_PROGRESS'
  return 'OPEN'
}
