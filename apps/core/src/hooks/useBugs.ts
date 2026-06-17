'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { normalizeBugsResponse } from '@/lib/bugs-contract'
import type { Bug, BugSeverity, BugStatus, Priority, User } from '@/types'

// ─── Query Key Factory ─────────────────────────────────────────

export const bugKeys = {
  all: ['bugs'] as const,
  lists: () => [...bugKeys.all, 'list'] as const,
  list: (filters: BugFilters) => [...bugKeys.lists(), filters] as const,
  details: () => [...bugKeys.all, 'detail'] as const,
  detail: (id: string) => [...bugKeys.details(), id] as const,
  stats: (projectId?: string) => [...bugKeys.all, 'stats', projectId] as const,
}

// ─── API Types ─────────────────────────────────────────────────

export interface BugFilters {
  projectId?: string
  severity?: BugSeverity
  status?: BugStatus
  priority?: Priority
  search?: string
  page?: number
  limit?: number
}

export interface ApiUser {
  id: string
  email?: string
  name: string
  avatar: string | null
  role?: string
}

interface ApiProject {
  id: string
  name: string
  coverColor: string
}

interface ApiBug {
  id: string
  bugId: string
  title: string
  description: string
  severity: string
  priority: string
  status: string
  environment: string | null
  stepsToReproduce: string | null
  expectedBehavior: string | null
  actualBehavior: string | null
  browserInfo: string | null
  osInfo: string | null
  buildVersion: string | null
  tags: string[]
  projectId: string
  assigneeId: string | null
  reporterId: string
  sprintId: string | null
  assignee: ApiUser | null
  reporter: ApiUser
  project: ApiProject
  _count?: { comments: number; attachments: number } | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

interface ApiBugStats {
  total: number
  open: number
  critical: number
  inProgress: number
  resolved: number
}

export interface PaginatedBugs {
  data: ApiBug[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Mapping ───────────────────────────────────────────────────

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email ?? '',
    username: u.email?.split('@')[0] ?? u.name.toLowerCase().replace(/\s+/g, '.'),
    name: u.name,
    avatar: u.avatar ?? undefined,
    role: (u.role as User['role']) ?? 'QA_ANALYST',
    isActive: true,
    createdAt: '',
  }
}

function mapBug(api: ApiBug): Bug {
  return {
    id: api.id,
    bugId: api.bugId,
    title: api.title,
    description: api.description,
    severity: api.severity as BugSeverity,
    priority: api.priority as Priority,
    status: api.status as BugStatus,
    environment: api.environment ?? undefined,
    stepsToReproduce: api.stepsToReproduce ?? undefined,
    expectedBehavior: api.expectedBehavior ?? undefined,
    actualBehavior: api.actualBehavior ?? undefined,
    browserInfo: api.browserInfo ?? undefined,
    osInfo: api.osInfo ?? undefined,
    buildVersion: api.buildVersion ?? undefined,
    tags: api.tags,
    projectId: api.projectId,
    assigneeId: api.assigneeId ?? undefined,
    reporterId: api.reporterId,
    sprintId: api.sprintId ?? undefined,
    assignee: api.assignee ? mapApiUser(api.assignee) : undefined,
    reporter: mapApiUser(api.reporter),
    project: {
      id: api.project.id,
      name: api.project.name,
      coverColor: api.project.coverColor,
    } as Bug['project'],
    resolvedAt: api.resolvedAt ?? undefined,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  }
}

// ─── Input Types ───────────────────────────────────────────────

export interface CreateBugInput {
  title: string
  description: string
  severity: BugSeverity
  priority: Priority
  projectId: string
  environment?: string
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  browserInfo?: string
  osInfo?: string
  buildVersion?: string
  assigneeId?: string
  sprintId?: string
  tags?: string[]
}

export interface UpdateBugInput {
  id: string
  title?: string
  description?: string
  severity?: BugSeverity
  priority?: Priority
  status?: BugStatus
  environment?: string
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  assigneeId?: string
  sprintId?: string
  tags?: string[]
}

export interface BulkSyncInput {
  items: Array<{
    id: string
    title: string
    priority: string
    status: string
    qaCategory: string
    client?: string
    project?: string
    sprint?: string
    source: string
    issueKey?: string
    notes?: string
    description?: string
    link?: string
    pullRequests?: Array<{ url: string; text?: string }>
    externalLinks?: Array<{ url: string; text?: string }>
    comments?: Array<{ body: string; author?: string }>
    importedAt: string
  }>
}

// ─── Hooks ─────────────────────────────────────────────────────

export function useBugs(filters?: BugFilters) {
  return useQuery({
    queryKey: bugKeys.list(filters ?? {}),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value))
          }
        })
      }
      const query = params.toString()
      const { data } = await api.get<PaginatedBugs | ApiBug[]>(`/bugs${query ? `?${query}` : ''}`)
      const normalized = normalizeBugsResponse<ApiBug>(data)
      return {
        ...normalized,
        data: normalized.data.map(mapBug),
      }
    },
  })
}

export function useBug(id: string) {
  return useQuery({
    queryKey: bugKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiBug>(`/bugs/${id}`)
      return mapBug(data)
    },
    enabled: !!id,
  })
}

export function useBugStats(projectId?: string) {
  return useQuery({
    queryKey: bugKeys.stats(projectId),
    queryFn: async () => {
      const params = projectId ? `?projectId=${projectId}` : ''
      const { data } = await api.get<ApiBugStats>(`/bugs/stats${params}`)
      return data
    },
  })
}

export function useCreateBug() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateBugInput) => {
      const { data } = await api.post<ApiBug>('/bugs', input)
      return mapBug(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bugKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bugKeys.stats() })
    },
  })
}

export function useUpdateBug() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateBugInput) => {
      const { id, ...updates } = input
      const { data } = await api.patch<ApiBug>(`/bugs/${id}`, updates)
      return mapBug(data)
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: bugKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bugKeys.detail(vars.id) })
      queryClient.invalidateQueries({ queryKey: bugKeys.stats() })
    },
  })
}

export function useDeleteBug() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/bugs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bugKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bugKeys.stats() })
    },
  })
}

export function useBulkSyncBugs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: BulkSyncInput) => {
      const { data } = await api.post<{ synced: number }>('/bugs/bulk-sync', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bugKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bugKeys.stats() })
    },
  })
}
