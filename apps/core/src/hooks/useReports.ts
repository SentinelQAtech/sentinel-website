'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardStats, BugTrendPoint, SprintVelocity } from '@/types'

export const reportKeys = {
  all: ['reports'] as const,
  dashboardStats: () => [...reportKeys.all, 'dashboard-stats'] as const,
  bugTrend: (days: number) => [...reportKeys.all, 'bug-trend', days] as const,
  sprintVelocity: (projectId: string, limit?: number) => [...reportKeys.all, 'sprint-velocity', projectId, limit] as const,
  teamProductivity: (projectId: string) => [...reportKeys.all, 'team-productivity', projectId] as const,
}

interface TeamProductivityMember {
  user: { id: string; name: string; avatar: string | null }
  tasksCompleted: number
  bugsResolved: number
  storyPoints: number
}

export function useDashboardStats() {
  return useQuery({
    queryKey: reportKeys.dashboardStats(),
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/reports/dashboard-stats')
      return data
    },
  })
}

export function useBugTrend(days: number = 30) {
  return useQuery({
    queryKey: reportKeys.bugTrend(days),
    queryFn: async () => {
      const { data } = await api.get<BugTrendPoint[]>(`/reports/bug-trend?days=${days}`)
      return data
    },
  })
}

export function useSprintVelocity(projectId: string, limit?: number) {
  return useQuery({
    queryKey: reportKeys.sprintVelocity(projectId, limit),
    queryFn: async () => {
      const params = new URLSearchParams({ projectId })
      if (limit !== undefined) params.set('limit', String(limit))
      const { data } = await api.get<SprintVelocity[]>(`/reports/sprint-velocity?${params}`)
      return data
    },
    enabled: !!projectId,
  })
}

export function useTeamProductivity(projectId: string) {
  return useQuery({
    queryKey: reportKeys.teamProductivity(projectId),
    queryFn: async () => {
      const { data } = await api.get<TeamProductivityMember[]>(`/reports/team-productivity?projectId=${projectId}`)
      return data
    },
    enabled: !!projectId,
  })
}
