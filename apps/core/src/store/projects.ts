import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '@/types'
import type { QAItem } from './qa-importer'
import { createUserWorkspaceStorage } from '@/lib/workspace-storage'

const _qaOwner = {
  id: '1',
  email: 'raphael@sentinel.tech',
  username: 'raphacastilho',
  name: 'Raphael Castilho',
  role: 'ADMIN' as const,
  isActive: true,
  createdAt: new Date().toISOString(),
}

const CLIENT_COLORS: Record<string, string> = {
  uol:         '#ef4444',
  concepta:    '#3b82f6',
  scrumlaunch: '#06b6d4',
  ambev:       '#f59e0b',
  pessoal:     '#8b5cf6',
}

function clientColor(client: string): string {
  return CLIENT_COLORS[client.toLowerCase()] ?? '#6366f1'
}

interface ProjectsState {
  projects: Project[]
  addProject:          (project: Project) => void
  deleteProject:       (id: string) => void
  updateProject:       (id: string, updates: Partial<Project>) => void
  syncFromQAImporter:  (items: QAItem[]) => void
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],

      addProject: (project) =>
        set(state => ({
          projects: [project, ...state.projects.filter(item => item.id !== project.id)],
        })),

      deleteProject: (id) =>
        set(state => ({ projects: state.projects.filter(project => project.id !== id) })),

      updateProject: (id, updates) =>
        set(state => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
          ),
        })),

      syncFromQAImporter: (items) =>
        set(s => {
          const now = new Date().toISOString()

          // Build unique map: project name → { client, color }
          const seen = new Map<string, { id: string; name: string; client: string; color: string }>()
          items.forEach(item => {
            const name = (item.project?.trim() || item.client?.trim())
            if (!name) return
            const id = `qa-proj-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            if (!seen.has(id)) {
              seen.set(id, { id, name, client: item.client ?? '', color: clientColor(item.client ?? '') })
            }
          })

          const existingIds = new Set(s.projects.map(p => p.id))
          const toAdd: Project[] = []

          seen.forEach(({ id, name, client, color }) => {
            if (existingIds.has(id)) return
            toAdd.push({
              id,
              name,
              description: client ? `Projeto QA — ${client}` : 'Projeto QA',
              status:      'ACTIVE',
              priority:    'MEDIUM',
              progress:    0,
              tags:        client ? [client] : [],
              clientName:  client || undefined,
              coverColor:  color,
              ownerId:     _qaOwner.id,
              owner:       _qaOwner,
              members:     [],
              createdAt:   now,
              updatedAt:   now,
            })
          })

          if (toAdd.length === 0) return s
          return { projects: [...toAdd, ...s.projects] }
        }),
    }),
    {
      name: 'sentinel-core-projects',
      version: 2,
      storage: createUserWorkspaceStorage(),
    }
  )
)
