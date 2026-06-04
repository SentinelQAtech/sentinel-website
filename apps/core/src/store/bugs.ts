import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Bug, BugSeverity, BugStatus, Priority, Project, User } from '@/types'
import type { QAItem, QAPriority } from './qa-importer'

export const defaultReporter: User = {
  id: '1',
  email: 'raphael@sentinel.tech',
  username: 'raphacastilho',
  name: 'Raphael Castilho',
  role: 'ADMIN',
  isActive: true,
  createdAt: new Date().toISOString(),
}

export const defaultProject: Project = {
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
  syncFromQAImporter: (items: QAItem[]) => void
}

export const useBugsStore = create<BugsState>()(
  persist(
    (set) => ({
      bugs: [],

      addBug: (bug) =>
        set(state => ({ bugs: [bug, ...state.bugs.filter(item => item.id !== bug.id)] })),

      syncFromQAImporter: (items) =>
        set(state => {
          // Keep only manually created bugs (not derived from QA Importer)
          const manualBugs = state.bugs.filter(b => !b.id.startsWith('qa-bug-'))
          const qaBugs: Bug[] = []

          items.filter(isBugItem).forEach(item => {
            const id = `qa-bug-${item.id}`
            const existing = state.bugs.find(b => b.id === id)
            qaBugs.push({
              id,
              bugId: item.issueKey || `BUG-${String(qaBugs.length + 1).padStart(3, '0')}`,
              title: item.title,
              description: buildQABugDescription(item) || 'Bug importado via QA Importer.',
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
              createdAt: existing?.createdAt ?? item.importedAt,
              updatedAt: new Date().toISOString(),
              resolvedAt: item.qaCategory === 'Done' ? new Date().toISOString() : undefined,
            })
          })

          return { bugs: [...qaBugs, ...manualBugs] }
        }),
    }),
    { name: 'sentinel-core-bugs', version: 2 }
  )
)

// All QA items are trackable — the Bugs module is the QA tracking board
function isBugItem(_item: QAItem) {
  return true
}

function buildQABugDescription(item: QAItem) {
  const comments = item.comments?.slice(0, 5).map((comment, index) => `Comentario ${index + 1}: ${comment.body}`).join('\n\n')
  const prs = item.pullRequests?.map(link => `PR: ${link.text || link.url} - ${link.url}`).join('\n')
  const links = item.externalLinks?.slice(0, 8).map(link => `Link: ${link.text || link.url} - ${link.url}`).join('\n')
  return [
    item.notes,
    item.description && `Descricao:\n${item.description}`,
    comments,
    prs,
    links,
    item.link && `Jira: ${item.link}`,
  ].filter(Boolean).join('\n\n')
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
