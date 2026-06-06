'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Project, ProjectStatus, Priority } from '@/types'

export const projectKeys = {
  all: ['projects'] as const,
  byId: (id: string) => ['projects', id] as const,
}

interface ApiUser {
  id: string
  email: string
  name: string
  avatar: string | null
}

interface ApiProjectMember {
  id: string
  projectId: string
  userId: string
  role: string
  user: { id: string; name: string; avatar: string | null; role: string }
}

interface ApiProject {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  startDate: string | null
  endDate: string | null
  progress: number
  tags: string[]
  clientName: string | null
  coverColor: string
  ownerId: string
  owner: ApiUser
  members: ApiProjectMember[]
  _count?: { tasks: number; bugs: number; sprints: number } | null
  createdAt: string
  updatedAt: string
}

function mapProject(p: ApiProject): Project {
  return {
    ...p,
    status: p.status as ProjectStatus,
    priority: p.priority as Priority,
    description: p.description ?? undefined,
    startDate: p.startDate ?? undefined,
    endDate: p.endDate ?? undefined,
    clientName: p.clientName ?? undefined,
    owner: {
      id: p.owner.id,
      email: p.owner.email,
      name: p.owner.name,
      avatar: p.owner.avatar ?? undefined,
      username: p.owner.email.split('@')[0],
      role: 'ADMIN' as const,
      isActive: true,
      createdAt: '',
    },
    members: p.members.map(m => ({
      ...m,
      role: m.role as Role,
      joinedAt: '',
      user: {
        id: m.user.id,
        email: '',
        username: '',
        name: m.user.name,
        role: m.user.role as Role,
        isActive: true,
        createdAt: '',
      },
    })),
    _count: p._count ?? undefined,
  }
}

type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'QA_ANALYST' | 'QA_ENGINEER' | 'DEVELOPER' | 'CLIENT_VIEWER'

export interface CreateProjectInput {
  name: string
  description?: string
  priority: Priority
  startDate?: string
  endDate?: string
  clientName?: string
  coverColor?: string
  tags?: string[]
}

export interface UpdateProjectInput {
  id: string
  name?: string
  description?: string
  status?: ProjectStatus
  priority?: Priority
  progress?: number
  startDate?: string
  endDate?: string
  clientName?: string
  coverColor?: string
  tags?: string[]
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: async () => {
      const { data } = await api.get<ApiProject[]>('/projects')
      return data.map(mapProject)
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.byId(id),
    queryFn: async () => {
      const { data } = await api.get<ApiProject>(`/projects/${id}`)
      return mapProject(data)
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data } = await api.post<ApiProject>('/projects', input)
      return mapProject(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateProjectInput) => {
      const { id, ...updates } = input
      const { data } = await api.patch<ApiProject>(`/projects/${id}`, updates)
      return mapProject(data)
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: projectKeys.byId(vars.id) })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}
