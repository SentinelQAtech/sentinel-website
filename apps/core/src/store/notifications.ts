import { create } from 'zustand'

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

const INITIAL: NotificationItem[] = []

interface NotificationsState {
  notifications: NotificationItem[]
  markAsRead:    (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationsStore = create<NotificationsState>()(set => ({
  notifications: INITIAL,

  markAsRead: (id) =>
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    })),

  markAllAsRead: () =>
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    })),
}))
