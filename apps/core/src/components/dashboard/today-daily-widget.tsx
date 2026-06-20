'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sun, ArrowRight, CheckCircle2, Circle,
  AlertCircle, Minus, Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRIORITY_CONFIG, CLIENT_CONFIG, REGION_CONFIG, getTodayISO } from '@/store/daily'
import { useDailyTasks, useDailyMeetings, useToggleDailyTask } from '@/hooks/useDaily'
import { useI18nStore } from '@/store/i18n'
import type { DailyStatus } from '@/store/daily'

const STATUS_ICON: Record<DailyStatus, { icon: React.ElementType; cls: string }> = {
  done:        { icon: CheckCircle2, cls: 'text-emerald-400' },
  in_progress: { icon: Minus,       cls: 'text-indigo-400'  },
  blocked:     { icon: AlertCircle, cls: 'text-red-400'      },
  todo:        { icon: Circle,      cls: 'text-white/20'     },
}

export function TodayDailyWidget() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const today = getTodayISO()
  const { tasks } = useDailyTasks(today)
  const { data: meetings = [] } = useDailyMeetings(today)
  const { toggle } = useToggleDailyTask()

  const total = tasks.length
  const done  = tasks.filter(t => t.status === 'done').length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  const sorted = [...tasks].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    if (a.status === 'done' && b.status !== 'done') return 1
    if (a.status !== 'done' && b.status === 'done') return -1
    return (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
  })

  const now    = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const allMeetings = [...meetings].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card border border-white/[0.07] overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-primary/60 via-violet-500/40 to-transparent" />

      {/* Strip 1 — Header + progress + action */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Sun className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/85 leading-none">{t('todayDaily')}</h3>
            <p className="text-[10px] text-white/35 mt-0.5">{done} de {total} {t('doneTasks')}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: pct === 100
                  ? 'linear-gradient(90deg,#10b981,#06b6d4)'
                  : 'linear-gradient(90deg,#6366f1,#8b5cf6)',
              }}
            />
          </div>
          <span
            className="text-xs font-bold tabular-nums shrink-0"
            style={{ color: pct === 100 ? '#10b981' : '#6366f1' }}
          >
            {pct}%
          </span>
        </div>

        <Link
          href="/daily"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 transition-all duration-150"
        >
          {t('openDaily')} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Strip 2 — Task list */}
      <div className="overflow-y-auto max-h-48 px-3 py-2 border-b border-white/[0.06]">
        {sorted.length === 0 ? (
          <p className="text-xs text-white/25 italic px-2 py-1">{t('noTasksToday')}</p>
        ) : (
          <div className="space-y-0.5">
            {sorted.map(task => {
              const pCfg  = PRIORITY_CONFIG[task.priority]
              const cCfg  = CLIENT_CONFIG[task.client]
              const sIcon = STATUS_ICON[task.status]
              const Icon  = sIcon.icon
              const isDone = task.status === 'done'

              return (
                <button
                  key={task.id}
                  onClick={() => toggle(task.id, task.status)}
                  title={isDone ? t('markPending') : t('markDone')}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-white/[0.04] group transition-colors"
                >
                  <Icon className={cn('w-3.5 h-3.5 shrink-0', sIcon.cls)} />
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: pCfg.color }}
                  />
                  <span className={cn(
                    'flex-1 text-[12px] truncate leading-none transition-colors',
                    isDone ? 'line-through text-white/25' : 'text-white/65 group-hover:text-white/90'
                  )}>
                    {task.title}
                  </span>
                  <span
                    className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      color:           cCfg?.color ?? '#6366f1',
                      backgroundColor: `${cCfg?.color ?? '#6366f1'}20`,
                    }}
                  >
                    {cCfg?.short ?? task.client}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Strip 3 — Meetings horizontal row */}
      <div className="px-4 py-2.5">
        <div className="flex items-center gap-1.5 mb-2 shrink-0">
          <Video className="w-3 h-3 text-cyan-400/70" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
            {t('meetings')}
          </span>
        </div>

        {allMeetings.length === 0 ? (
          <p className="text-xs text-white/25 italic">{t('noMeetingsToday')}</p>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allMeetings.map(m => {
              const rCfg = REGION_CONFIG[m.region]
              const [h, min] = m.time.split(':').map(Number)
              const isPast = h * 60 + min < nowMin

              return (
                <div
                  key={m.id}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shrink-0 transition-opacity',
                    isPast
                      ? 'border-white/[0.04] bg-transparent opacity-30'
                      : 'border-cyan-400/15 bg-cyan-400/5'
                  )}
                >
                  <span className="text-sm leading-none">{rCfg?.flag ?? '🌐'}</span>
                  <span className="text-[11px] font-mono font-semibold text-white/70 tabular-nums">
                    {m.time}
                  </span>
                  <span className="text-[11px] text-white/50 max-w-[96px] truncate">
                    {m.title ?? m.region}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
