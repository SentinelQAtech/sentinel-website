'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Bug, Zap, GitBranch, MessageSquare, AtSign, Bell } from 'lucide-react'
import { useI18nStore } from '@/store/i18n'
import { useNotifications, type NotificationItem } from '@/hooks/useNotifications'

const typeConfig: Record<NotificationItem['type'], { icon: ReactNode; color: string; bg: string }> = {
  bug:     { icon: <Bug className="w-3 h-3" />,           color: 'text-red-400',     bg: 'bg-red-500/15'     },
  sprint:  { icon: <Zap className="w-3 h-3" />,           color: 'text-violet-400',  bg: 'bg-violet-500/15'  },
  project: { icon: <GitBranch className="w-3 h-3" />,     color: 'text-amber-400',   bg: 'bg-amber-500/15'   },
  mention: { icon: <AtSign className="w-3 h-3" />,        color: 'text-blue-400',    bg: 'bg-blue-500/15'    },
  alert:   { icon: <MessageSquare className="w-3 h-3" />, color: 'text-cyan-400',    bg: 'bg-cyan-500/15'    },
}

export function RecentActivity() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const { data: notifications = [], isLoading } = useNotifications()
  const recent = notifications.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Atividade Recente</CardTitle>
        </div>
        <span className="text-xs text-white/40">Notificações do workspace</span>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="relative">
          <div className="absolute left-[18px] top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/[0.05] to-transparent" />

          <div className="space-y-0">
            {!isLoading && recent.length === 0 && (
              <div className="py-8 text-center text-sm text-white/35">
                {t('emptyRecentActivity')}
              </div>
            )}

            {recent.map((n, i) => {
              const cfg = typeConfig[n.type] ?? typeConfig.alert
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
                  className="flex items-start gap-3 py-2.5 group"
                >
                  <div className="relative shrink-0 z-10">
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center',
                      cfg.bg, cfg.color,
                      'transition-transform duration-200 group-hover:scale-110'
                    )}>
                      {cfg.icon}
                    </div>
                    {!n.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-1.5">
                    <p className="text-xs leading-snug">
                      <span className={cn('font-semibold', n.read ? 'text-white/70' : 'text-white/90')}>
                        {n.title}
                      </span>
                      {n.body && <span className="text-white/40 ml-1">{n.body}</span>}
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">{n.time}</p>
                  </div>

                  <Bell className="w-3 h-3 text-white/15 shrink-0 mt-1.5" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
