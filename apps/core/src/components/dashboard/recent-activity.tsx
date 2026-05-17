'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { timeAgo, cn } from '@/lib/utils'
import { Bug, CheckSquare, MessageSquare, UserPlus, Zap, GitBranch, Radio } from 'lucide-react'
import { useI18nStore } from '@/store/i18n'

type ActionType = 'bug_created' | 'task_done' | 'comment' | 'member_added' | 'sprint_started' | 'status_changed'
type Activity = { type: ActionType; user: { name: string }; text: string; time: string }

const activityConfig: Record<ActionType, { icon: ReactNode; color: string; bg: string }> = {
  bug_created:    { icon: <Bug className="w-3 h-3" />,           color: 'text-red-400',     bg: 'bg-red-500/15'     },
  task_done:      { icon: <CheckSquare className="w-3 h-3" />,   color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  comment:        { icon: <MessageSquare className="w-3 h-3" />, color: 'text-blue-400',    bg: 'bg-blue-500/15'    },
  member_added:   { icon: <UserPlus className="w-3 h-3" />,      color: 'text-cyan-400',    bg: 'bg-cyan-500/15'    },
  sprint_started: { icon: <Zap className="w-3 h-3" />,           color: 'text-violet-400',  bg: 'bg-violet-500/15'  },
  status_changed: { icon: <GitBranch className="w-3 h-3" />,     color: 'text-amber-400',   bg: 'bg-amber-500/15'   },
}

const activities: Activity[] = []
const RECENT_THRESHOLD = 1000 * 60 * 10

export function RecentActivity() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const now = Date.now()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Atividade Recente</CardTitle>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-400">Live</span>
          </div>
        </div>
        <span className="text-xs text-white/40">Ultimas 24h</span>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="relative">
          <div className="absolute left-[18px] top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/[0.05] to-transparent" />

          <div className="space-y-0">
            {activities.length === 0 && (
              <div className="py-8 text-center text-sm text-white/35">
                {t('emptyRecentActivity')}
              </div>
            )}

            {activities.map((a, i) => {
              const cfg = activityConfig[a.type]
              const isNew = now - new Date(a.time).getTime() < RECENT_THRESHOLD

              return (
                <motion.div
                  key={i}
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
                    {isNew && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-1.5">
                    <p className="text-xs leading-snug">
                      <span className={cn('font-semibold', isNew ? 'text-white/90' : 'text-white/70')}>
                        {a.user.name}
                      </span>
                      <span className="text-white/40 ml-1">{a.text}</span>
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">{timeAgo(a.time)}</p>
                  </div>

                  {isNew && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/15 text-primary border border-primary/25 leading-none mt-1.5">
                      new
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
