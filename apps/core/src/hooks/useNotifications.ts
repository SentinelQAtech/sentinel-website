'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: () => [...notificationKeys.lists()] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

interface ApiNotification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  link: string | null
  createdAt: string
}

export interface NotificationItem {
  id:    string
  type:  'bug' | 'sprint' | 'project' | 'mention' | 'alert'
  title: string
  body:  string
  time:  string
  read:  boolean
  color: string
  href:  string
}

const TYPE_MAP: Record<string, NotificationItem['type']> = {
  MENTION:       'mention',
  COMMENT:       'mention',
  STATUS_CHANGE: 'project',
  ASSIGNMENT:    'alert',
  DEADLINE:      'alert',
  BUG_CREATED:   'bug',
  SPRINT_START:  'sprint',
}

const TYPE_COLOR: Record<NotificationItem['type'], string> = {
  bug:     '#ef4444',
  sprint:  '#10b981',
  project: '#06b6d4',
  mention: '#8b5cf6',
  alert:   '#f59e0b',
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}m atrás`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atrás`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function mapNotification(n: ApiNotification): NotificationItem {
  const type = TYPE_MAP[n.type] ?? 'alert'
  return {
    id: n.id,
    type,
    title: n.title,
    body: n.message,
    time: formatTime(n.createdAt),
    read: n.isRead,
    color: TYPE_COLOR[type],
    href: n.link ?? '/notifications',
  }
}

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<ApiNotification[]>('/notifications')
      return data.map(mapNotification)
    },
    refetchInterval: 30_000,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/notifications/unread-count')
      return data.count
    },
    refetchInterval: 30_000,
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
