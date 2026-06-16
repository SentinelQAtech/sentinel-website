'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Sprint, SprintStatus } from '@/types'

// ─── Query Key Factory ─────────────────────────────────────────

export const sprintKeys = {
  all: ['sprints'] as const,
  lists: () => [...sprintKeys.all, 'list'] as const,
  list: (projectId: string) => [...sprintKeys.lists(), projectId] as const,
  details: () => [...sprintKeys.all, 'detail'] as const,
  detail: (id: string) => [...sprintKeys.details(), id] as const,
  burndown: (id: string) => [...sprintKeys.all, 'burndown', id] as const,
}

// ─── API Types ─────────────────────────────────────────────────

interface ApiSprint {
  id: string
  name: string
  goal: string | null
  status: string
  startDate: string
  endDate: string
  velocity: number | null
  capacity: number | null
  projectId: string
  createdAt: string
  updatedAt: string
  _count?: {
    tasks: number
    bugs: number
    members?: number
  } | null
  tasks?: Array<{
    id: string
    title: string
    status: string
    priority: string
    storyPoints: number | null
    assignee: { id: string; name: string; avatar: string | null } | null
  }>
  bugs?: Array<{
    id: string
    bugId: string
    title: string
    severity: string
    status: string
  }>
}

export interface SprintBurndown {
  totalPoints: number
  completedPoints: number
}

// ─── Mapping ───────────────────────────────────────────────────

function mapSprint(api: ApiSprint): Sprint {
  return {
    id: api.id,
    name: api.name,
    goal: api.goal ?? undefined,
    status: api.status as SprintStatus,
    startDate: api.startDate,
    endDate: api.endDate,
    velocity: api.velocity ?? undefined,
    capacity: api.capacity ?? undefined,
    projectId: api.projectId,
    _count: api._count ?? undefined,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  }
}

// ─── Input Types ───────────────────────────────────────────────

export interface CreateSprintInput {
  name: string
  goal?: string
  status?: SprintStatus
  startDate: string
  endDate: string
  projectId: string
  capacity?: number
}

export interface UpdateSprintInput {
  id: string
  name?: string
  goal?: string
  status?: SprintStatus
  startDate?: string
  endDate?: string
  capacity?: number
}

// ─── Hooks ─────────────────────────────────────────────────────

export function useSprints(projectId: string) {
  return useQuery({
    queryKey: sprintKeys.list(projectId),
    queryFn: async () => {
      const { data } = await api.get<ApiSprint[]>(`/sprints?projectId=${projectId}`)
      return data.map(mapSprint)
    },
    enabled: !!projectId,
  })
}

export function useSprint(id: string) {
  return useQuery({
    queryKey: sprintKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiSprint>(`/sprints/${id}`)
      return mapSprint(data)
    },
    enabled: !!id,
  })
}

export function useSprintBurndown(id: string) {
  return useQuery({
    queryKey: sprintKeys.burndown(id),
    queryFn: async () => {
      const { data } = await api.get<{ totalPoints: number; completedPoints: number }>(`/sprints/${id}/burndown`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateSprintInput) => {
      const { data } = await api.post<ApiSprint>('/sprints', input)
      return mapSprint(data)
    },
    onSuccess: (sprint) => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sprintKeys.detail(sprint.id) })
    },
  })
}

export function useUpdateSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateSprintInput) => {
      const { id, ...updates } = input
      const { data } = await api.patch<ApiSprint>(`/sprints/${id}`, updates)
      return mapSprint(data)
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sprintKeys.detail(vars.id) })
    },
  })
}

export function useDeleteSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/sprints/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.lists() })
    },
  })
}
