'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  useQAItems,
  useUpdateQAItemDailyStatus,
  type BackendDailyStatus,
} from '@/hooks/useQAItems'
import type { QAItem } from '@/store/qa-importer'
import type { DailyMeeting, DailyTask, DailyPriority, DailyStatus, DailyType } from '@/store/daily'

// ─── Daily tasks (backed by QA items with sentToDaily) ──────────
// The single operational "task" model is a QA item placed on the Daily.
// These helpers project it onto the DailyTask shape the UI already uses.

function dailyStatusFromQA(status?: string): DailyStatus {
  if (status === 'doing') return 'in_progress'
  if (status === 'done') return 'done'
  if (status === 'blocked') return 'blocked'
  return 'todo'
}

function priorityFromQA(priority?: string): DailyPriority {
  if (priority === 'Critical') return 'Critical'
  if (priority === 'High') return 'High'
  if (priority === 'Low') return 'Low'
  return 'Medium'
}

export function qaItemToDailyTask(item: QAItem): DailyTask {
  return {
    id: item.id,
    date: item.dailyDate,
    client: item.client || '',
    title: item.title,
    type: (item.type as DailyType) || 'Card Work',
    priority: priorityFromQA(item.priority),
    status: dailyStatusFromQA(item.dailyStatus),
    notes: item.notes || undefined,
    qaSourceId: item.id,
  }
}

/** Tasks placed on the Daily for a specific date. */
export function useDailyTasks(date: string) {
  const query = useQAItems({ sentToDaily: true, dailyDate: date })
  return { ...query, tasks: (query.data ?? []).map(qaItemToDailyTask) }
}

/** Every task ever placed on the Daily (for history/aggregates). */
export function useAllDailyTasks() {
  const query = useQAItems({ sentToDaily: true })
  return { ...query, tasks: (query.data ?? []).map(qaItemToDailyTask) }
}

/** Toggle a daily task between done and todo (writes through to the API). */
export function useToggleDailyTask() {
  const mutation = useUpdateQAItemDailyStatus()
  return {
    ...mutation,
    toggle: (id: string, currentStatus: DailyStatus) => {
      const next: BackendDailyStatus = currentStatus === 'done' ? 'todo' : 'done'
      mutation.mutate({ id, dailyStatus: next })
    },
  }
}

// ─── Daily meetings (backed by the API) ─────────────────────────

interface ApiDailyMeeting {
  id: string
  date: string
  region: string
  time: string
  title: string | null
  participants: string | null
  notes: string | null
}

export const dailyMeetingKeys = {
  all: ['daily', 'meetings'] as const,
  list: (date?: string) => ['daily', 'meetings', date ?? 'all'] as const,
}

function mapMeeting(m: ApiDailyMeeting): DailyMeeting {
  return {
    id: m.id,
    date: m.date?.slice(0, 10),
    region: m.region,
    time: m.time,
    title: m.title ?? undefined,
    participants: m.participants ?? undefined,
    notes: m.notes ?? undefined,
  }
}

export interface CreateDailyMeetingInput {
  date?: string
  region?: string
  time: string
  title?: string
  participants?: string
  notes?: string
}

export function useDailyMeetings(date?: string) {
  return useQuery({
    queryKey: dailyMeetingKeys.list(date),
    queryFn: async () => {
      const qs = date ? `?date=${date}` : ''
      const { data } = await api.get<ApiDailyMeeting[]>(`/daily/meetings${qs}`)
      return data.map(mapMeeting)
    },
  })
}

export function useCreateDailyMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateDailyMeetingInput) => {
      const { data } = await api.post<ApiDailyMeeting>('/daily/meetings', input)
      return mapMeeting(data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dailyMeetingKeys.all }),
  })
}

export function useDeleteDailyMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/daily/meetings/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dailyMeetingKeys.all }),
  })
}
