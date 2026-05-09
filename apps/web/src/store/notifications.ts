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

const INITIAL: NotificationItem[] = [
  {
    id: 'n1', type: 'bug', read: false, color: '#ef4444', href: '/bugs',
    title: 'Novo bug crítico reportado',
    body:  'BUG-042 · Auth token not refreshing — atribuído a você',
    time:  '2 min atrás',
  },
  {
    id: 'n2', type: 'sprint', read: false, color: '#8b5cf6', href: '/sprints',
    title: 'Sprint 14 iniciado',
    body:  'SPM Frontend · 12 tarefas planejadas · termina em 14 dias',
    time:  '1h atrás',
  },
  {
    id: 'n3', type: 'mention', read: false, color: '#06b6d4', href: '/projects',
    title: 'Menção em comentário',
    body:  'Antonio mencionou você em E-Commerce Platform · "revisar PR"',
    time:  '3h atrás',
  },
  {
    id: 'n4', type: 'project', read: true, color: '#f59e0b', href: '/projects',
    title: 'Projeto atualizado',
    body:  'Brewery QA Automation movido para "Em Andamento"',
    time:  'Ontem',
  },
  {
    id: 'n5', type: 'alert', read: true, color: '#f97316', href: '/sprints',
    title: 'Prazo se aproximando',
    body:  'Sprint Tracker App · entrega em 3 dias',
    time:  'Ontem',
  },
]

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
