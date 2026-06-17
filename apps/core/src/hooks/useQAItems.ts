'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  QAItem,
  QAItemSource,
  QACategory,
  QADailyStatus,
  QAResolution,
  QAResolutionResult,
} from '@/store/qa-importer'

export const qaItemKeys = {
  all: ['qa-items'] as const,
  lists: () => [...qaItemKeys.all, 'list'] as const,
  list: (filters: QAItemFilters = {}) => [...qaItemKeys.lists(), filters] as const,
  details: () => [...qaItemKeys.all, 'detail'] as const,
  detail: (id: string) => [...qaItemKeys.details(), id] as const,
}

export interface QAItemFilters {
  projectId?: string
  sprintId?: string
  workflowState?: QAWorkflowState
  dailyDate?: string
  sentToDaily?: boolean
  priority?: string
  status?: string
  search?: string
  includeArchived?: boolean
}

export type QAWorkflowState = 'inbox' | 'planned' | 'in_testing' | 'review' | 'blocked' | 'done'
export type BackendDailyStatus = 'todo' | 'doing' | 'blocked' | 'done'
export type BackendResolution = 'pass' | 'fail' | 'partial' | 'blocked'

interface ApiQAItem {
  id: string
  workspaceId: string
  clientId: string | null
  clientName: string | null
  projectId: string | null
  sprintId: string | null
  title: string
  description: string | null
  source: string
  externalKey: string | null
  externalUrl: string | null
  priority: string
  category: string
  status: string
  workflowState: QAWorkflowState
  dailyStatus: BackendDailyStatus | null
  dailyDate: string | null
  dailyOrder: number | null
  sentToDaily: boolean
  resolution: BackendResolution | null
  resolutionDetails: Record<string, unknown> | null
  evidence: Record<string, unknown> | null
  riskLevel: string | null
  severity: string | null
  assigneeId: string | null
  createdById: string
  createdByAuthId: string | null
  notes: string | null
  itemType: string | null
  metadata: Record<string, unknown> | null
  importedAt: string
  archivedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  sprint?: { id: string; name: string } | null
  project?: { id: string; name: string } | null
}

export interface QAItemInput {
  title: string
  clientName?: string
  projectId?: string
  sprintId?: string
  description?: string
  source?: QAItemSource
  externalKey?: string
  externalUrl?: string
  priority?: string
  category?: string
  status?: string
  workflowState?: QAWorkflowState
  dailyStatus?: BackendDailyStatus
  dailyDate?: string
  dailyOrder?: number
  sentToDaily?: boolean
  resolution?: BackendResolution
  resolutionDetails?: Record<string, unknown>
  evidence?: Record<string, unknown>
  riskLevel?: string
  severity?: string
  assigneeId?: string
  notes?: string
  itemType?: string
  metadata?: Record<string, unknown>
}

export interface ImportQAItemsInput {
  items: QAItemInput[]
}

function getMetadataArray<T>(metadata: Record<string, unknown> | null, key: string): T[] {
  const value = metadata?.[key]
  return Array.isArray(value) ? value as T[] : []
}

function mapResolution(value: BackendResolution | null, details: Record<string, unknown> | null): QAResolution | undefined {
  if (!value && !details) return undefined
  const result: QAResolutionResult =
    value === 'pass' ? 'PASS' :
    value === 'fail' ? 'FAIL' :
    value === 'partial' ? 'PARTIAL' :
    'BLOCKED'

  return {
    result,
    coreObjective: String(details?.coreObjective ?? ''),
    coreFlow: String(details?.coreFlow ?? ''),
    secondaryFlows: String(details?.secondaryFlows ?? ''),
    visualValidation: String(details?.visualValidation ?? ''),
    regressionRisk: String(details?.regressionRisk ?? ''),
    validatedItems: String(details?.validatedItems ?? ''),
    failedItems: String(details?.failedItems ?? ''),
    observedBehavior: String(details?.observedBehavior ?? ''),
    evidence: String(details?.evidence ?? ''),
    environment: String(details?.environment ?? ''),
    browser: String(details?.browser ?? ''),
    buildVersion: String(details?.buildVersion ?? ''),
    report: String(details?.report ?? ''),
    resolvedAt: String(details?.resolvedAt ?? ''),
  }
}

export function mapApiQAItem(apiItem: ApiQAItem): QAItem {
  const metadata = apiItem.metadata
  return {
    id: apiItem.id,
    source: (apiItem.source || 'manual') as QAItemSource,
    issueKey: apiItem.externalKey ?? '',
    title: apiItem.title,
    client: apiItem.clientName ?? '',
    project: apiItem.project?.name ?? apiItem.projectId ?? '',
    status: apiItem.status,
    priority: (apiItem.priority || 'Unknown') as QAItem['priority'],
    sprint: apiItem.sprint?.name ?? String(metadata?.sprintName ?? apiItem.sprintId ?? ''),
    assignee: String(metadata?.assignee ?? ''),
    type: apiItem.itemType ?? '',
    link: apiItem.externalUrl ?? '',
    notes: apiItem.notes ?? '',
    description: apiItem.description ?? '',
    comments: getMetadataArray(metadata, 'comments'),
    devNotes: String(metadata?.devNotes ?? ''),
    pullRequests: getMetadataArray(metadata, 'pullRequests'),
    externalLinks: getMetadataArray(metadata, 'externalLinks'),
    lastSyncedAt: apiItem.updatedAt,
    importDepth: metadata?.importDepth === 'deep' ? 'deep' : 'board',
    deepImportError: String(metadata?.deepImportError ?? ''),
    importedAt: apiItem.importedAt,
    sentToDaily: apiItem.sentToDaily,
    qaCategory: (apiItem.category || 'Other') as QACategory,
    workflowState: apiItem.workflowState,
    resolution: mapResolution(apiItem.resolution, apiItem.resolutionDetails),
    dailyStatus: apiItem.dailyStatus as QADailyStatus | undefined,
    dailyOrder: apiItem.dailyOrder ?? undefined,
    dailyDate: apiItem.dailyDate?.slice(0, 10),
    sentToDailyAt: String(metadata?.sentToDailyAt ?? ''),
  }
}

function queryString(filters: QAItemFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  })
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function useQAItems(filters: QAItemFilters = {}) {
  return useQuery({
    queryKey: qaItemKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<ApiQAItem[]>(`/qa-items${queryString(filters)}`)
      return data.map(mapApiQAItem)
    },
  })
}

export function useQAItem(id: string) {
  return useQuery({
    queryKey: qaItemKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiQAItem>(`/qa-items/${id}`)
      return mapApiQAItem(data)
    },
    enabled: !!id,
  })
}

function invalidateQAItems(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: qaItemKeys.lists() })
}

export function useCreateQAItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: QAItemInput) => {
      const { data } = await api.post<ApiQAItem>('/qa-items', input)
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useImportQAItems() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ImportQAItemsInput) => {
      const { data } = await api.post<{ items: ApiQAItem[]; added: number; updated: number; total: number; skipped: number }>('/qa-items/import', input)
      return { ...data, items: data.items.map(mapApiQAItem) }
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useUpdateQAItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<QAItemInput> }) => {
      const { data } = await api.patch<ApiQAItem>(`/qa-items/${id}`, updates)
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useArchiveQAItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/qa-items/${id}`)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useSendQAItemToDaily() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dailyDate }: { id: string; dailyDate?: string }) => {
      const { data } = await api.post<ApiQAItem>(`/qa-items/${id}/send-to-daily`, { dailyDate })
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useUpdateQAItemWorkflowState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, workflowState }: { id: string; workflowState: QAWorkflowState }) => {
      const { data } = await api.patch<ApiQAItem>(`/qa-items/${id}/workflow-state`, { workflowState })
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useUpdateQAItemDailyStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dailyStatus }: { id: string; dailyStatus: BackendDailyStatus }) => {
      const { data } = await api.patch<ApiQAItem>(`/qa-items/${id}/daily-status`, { dailyStatus })
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useMoveQAItemDailyOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const { data } = await api.patch<ApiQAItem>(`/qa-items/${id}/daily-order/${direction}`)
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}

export function useRecordQAItemResolution() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: {
      resolution: BackendResolution
      resolutionDetails?: Record<string, unknown>
      evidence?: Record<string, unknown>
      severity?: string
      riskLevel?: string
      status?: string
      category?: string
    } }) => {
      const { data } = await api.post<ApiQAItem>(`/qa-items/${id}/resolution`, payload)
      return mapApiQAItem(data)
    },
    onSuccess: () => invalidateQAItems(queryClient),
  })
}
