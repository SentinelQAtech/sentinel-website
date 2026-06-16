'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Bug, CheckCheck, Filter, FolderKanban, MessageSquare, Search, Zap, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications'
import type { NotificationItem } from '@/hooks/useNotifications'

const TYPE_ICON: Record<NotificationItem['type'], ReactNode> = {
  bug: <Bug className="h-4 w-4" />,
  sprint: <Zap className="h-4 w-4" />,
  project: <FolderKanban className="h-4 w-4" />,
  mention: <MessageSquare className="h-4 w-4" />,
  alert: <AlertCircle className="h-4 w-4" />,
}

type FilterMode = 'all' | 'unread' | NotificationItem['type']

export default function NotificationsPage() {
  const router = useRouter()
  const { data: notificationsData } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  const notifications = notificationsData ?? []
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')

  const unread = notifications.filter(item => !item.read).length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notifications.filter(item => {
      const matchesQuery = !q ||
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' ? !item.read : item.type === filter)
      return matchesQuery && matchesFilter
    })
  }, [filter, notifications, query])

  const openNotification = (notification: NotificationItem) => {
    markAsRead.mutate(notification.id)
    router.push(notification.href)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Bell className="h-6 w-6 text-primary" />
            Notificacoes
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            Central para acompanhar alertas, mencoes e atualizacoes do workspace.
          </p>
        </div>
        <button
          onClick={() => markAllAsRead.mutate()}
          disabled={unread === 0}
          className={cn(
            'flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors',
            unread > 0
              ? 'border-primary/30 bg-primary/15 text-primary hover:bg-primary/25'
              : 'border-white/[0.08] bg-white/[0.03] text-white/25'
          )}
        >
          <CheckCheck className="h-4 w-4" />
          Marcar todas como lidas
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total" value={notifications.length} />
        <Stat label="Nao lidas" value={unread} />
        <Stat label="Projetos" value={notifications.filter(item => item.type === 'project').length} />
        <Stat label="Alertas" value={notifications.filter(item => item.type === 'alert' || item.type === 'bug').length} />
      </div>

      <div className="glass-card flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar notificacoes..."
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary/40"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-white/25" />
          {(['all', 'unread', 'bug', 'project', 'sprint', 'mention', 'alert'] as FilterMode[]).map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                filter === item
                  ? 'border-primary/30 bg-primary/15 text-primary'
                  : 'border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/65'
              )}
            >
              {item === 'all' ? 'Todas' : item === 'unread' ? 'Nao lidas' : item}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden border border-white/[0.07]">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="mx-auto mb-3 h-10 w-10 text-white/15" />
            <p className="text-sm text-white/40">Nenhuma notificacao encontrada.</p>
          </div>
        ) : filtered.map(notification => (
          <button
            key={notification.id}
            onClick={() => openNotification(notification)}
            className={cn(
              'flex w-full items-start gap-4 border-b border-white/[0.05] px-5 py-4 text-left last:border-none hover:bg-white/[0.035]',
              !notification.read && 'bg-primary/[0.035]'
            )}
          >
            <div
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              style={{ color: notification.color, backgroundColor: notification.color + '18', borderColor: notification.color + '30' }}
            >
              {TYPE_ICON[notification.type]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className={cn('truncate text-sm font-semibold', notification.read ? 'text-white/55' : 'text-white/90')}>
                  {notification.title}
                </p>
                {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-white/40">{notification.body}</p>
              <p className="mt-2 text-xs text-white/25">{notification.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card border border-white/[0.07] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white tabular-nums">{value}</p>
    </div>
  )
}
