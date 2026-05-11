import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '@/types'

interface ProjectsState {
  projects: Project[]
  addProject: (project: Project) => void
  deleteProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
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
    }),
    { name: 'spm-projects', version: 1 }
  )
)
