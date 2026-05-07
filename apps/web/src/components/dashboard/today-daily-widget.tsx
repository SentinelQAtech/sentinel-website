'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sun, ArrowRight, Clock, CheckSquare, Video, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, PRIORITY_CONFIG, CLIENT_CONFIG } from '@/store/daily'

export function TodayDailyWidget() {
  const tasks    = useDailyStore(s => s.tasks)
  const meetings = useDailyStore(s => s.meetings)

  const total     = tasks.length
  const done      = tasks.filter(t => t.status === 'done').length
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0
  const clients   = new Set(tasks.map(t => t.client)).size

  const topTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
      return order[a.priority] - order[b.priority]
    })
    .slice(0, 3)

  // Next meetings sorted by time
  const now     = new Date()
  const nowMin  = now.getHours() * 60 + now.getMinutes()
  const nextMeetings = [...meetings]
    .sort((a, b) => a.time.localeCompare(b.time))
    .filter(m => {
      const [h, min] = m.time.split(':').map(Number)
      return h * 60 + min >= nowMin
    })
    .slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card border border-white/[0.07] overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-primary/60 via-violet-500/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Sun className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/85">Daily de Hoje</h3>
            <p className="text-[10px] text-white/35">{clients} clientes · {meetings.length} reuniões</p>
          </div>
        </div>
        <Link
          href="/daily"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
            'bg-primary/15 border border-primary/25 text-primary',
            'hover:bg-primary/25 transition-all duration-150'
          )}
        >
          Abrir Daily
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs font-medium text-white/50">Progresso</span>
          </div>
          <span className="text-xs font-bold tabular-nums" style={{
            color: pct === 100 ? '#10b981' : pct >= 50 ? '#6366f1' : '#f59e0b'
          }}>
            {done}/{total} · {pct}%
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: pct === 100
                ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 pb-5">
        {/* Top priority tasks */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              Prioridades
            </span>
          </div>
          {topTasks.length === 0 ? (
            <p className="text-xs text-white/25 italic">Tudo concluído 🎉</p>
          ) : (
            <div className="space-y-1.5">
              {topTasks.map(t => {
                const pCfg    = PRIORITY_CONFIG[t.priority]
                const cliCfg  = CLIENT_CONFIG[t.client]
                return (
                  <div key={t.id} className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: pCfg.color }}
                    />
                    <span className="text-[11px] text-white/60 truncate flex-1">{t.title}</span>
                    <span className="text-[10px] font-semibold shrink-0" style={{ color: cliCfg?.color ?? '#6366f1' }}>
                      {t.client}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming meetings */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Video className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              Próximas Reuniões
            </span>
          </div>
          {nextMeetings.length === 0 ? (
            <p className="text-xs text-white/25 italic">Sem reuniões pendentes</p>
          ) : (
            <div className="space-y-1.5">
              {nextMeetings.map(m => (
                <div key={m.id} className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-white/25 shrink-0" />
                  <span className="text-[11px] font-mono font-semibold text-white/70">{m.time}</span>
                  <span className="text-[11px] text-white/40 truncate">{m.region}</span>
                  {m.title && (
                    <span className="text-[10px] text-white/25 truncate">{m.title}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
