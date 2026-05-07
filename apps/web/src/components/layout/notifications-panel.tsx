'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Bug, Zap, FolderKanban, CheckCheck, X, AlertCircle, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'bug' | 'sprint' | 'project' | 'mention' | 'alert'
  title: string
  body: string
  time: string
  read: boolean
  icon: React.ReactNode
  color: string
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', type: 'bug', read: false,
    title: 'Novo bug crítico reportado',
    body: 'BUG-042 · Auth token not refreshing — atribuído a você',
    time: '2 min atrás',
    icon: <Bug className="w-3.5 h-3.5" />, color: '#ef4444',
  },
  {
    id: 'n2', type: 'sprint', read: false,
    title: 'Sprint 14 iniciado',
    body: 'SPM Frontend · 12 tarefas planejadas · termina em 14 dias',
    time: '1h atrás',
    icon: <Zap className="w-3.5 h-3.5" />, color: '#8b5cf6',
  },
  {
    id: 'n3', type: 'mention', read: false,
    title: 'Menção em comentário',
    body: 'Antonio mencionou você em E-Commerce Platform · "revisar PR"',
    time: '3h atrás',
    icon: <MessageSquare className="w-3.5 h-3.5" />, color: '#06b6d4',
  },
  {
    id: 'n4', type: 'project', read: true,
    title: 'Projeto atualizado',
    body: 'Brewery QA Automation movido para "Em Andamento"',
    time: 'Ontem',
    icon: <FolderKanban className="w-3.5 h-3.5" />, color: '#f59e0b',
  },
  {
    id: 'n5', type: 'alert', read: true,
    title: 'Prazo se aproximando',
    body: 'Sprint Tracker App · entrega em 3 dias',
    time: 'Ontem',
    icon: <AlertCircle className="w-3.5 h-3.5" />, color: '#f97316',
  },
]

interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

export function NotificationsPanel({ open, onClose, anchorRef }: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose, anchorRef])

  function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-80 dropdown-panel z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-white/50" />
              <span className="text-sm font-semibold text-white/85">Notificações</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-primary border border-primary/30">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllAsRead}
                title="Marcar todas como lidas"
                disabled={unread === 0}
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-150',
                  unread > 0
                    ? 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
                    : 'text-white/15 cursor-default'
                )}
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto scrollbar-hide">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-100',
                  'hover:bg-white/[0.04] border-b border-white/[0.04] last:border-none',
                  !n.read && 'bg-white/[0.02]'
                )}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: n.color + '20', color: n.color }}
                >
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-medium leading-snug truncate', n.read ? 'text-white/50' : 'text-white/85')}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-white/35 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-white/25 mt-1">{n.time}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/[0.06]">
            <button className="w-full text-center text-xs text-primary hover:text-primary/80 transition-colors py-0.5">
              Ver todas as notificações
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
