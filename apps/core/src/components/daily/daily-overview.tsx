'use client'

import { motion } from 'framer-motion'
import { CheckSquare, AlertTriangle, Video, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore } from '@/store/daily'

export function DailyOverview() {
  const tasks    = useDailyStore(s => s.tasks)
  const meetings = useDailyStore(s => s.meetings)

  const total     = tasks.length
  const done      = tasks.filter(t => t.status === 'done').length
  const highPrio  = tasks.filter(t => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'done').length
  const clients   = new Set(tasks.map(t => t.client)).size
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0

  const stats = [
    { label: 'Total Tarefas',   value: total,    icon: <CheckSquare className="w-4 h-4" />, color: '#6366f1', border: 'border-indigo-500/20'  },
    { label: 'Alta Prioridade', value: highPrio,  icon: <AlertTriangle className="w-4 h-4" />, color: '#f97316', border: 'border-orange-500/20'  },
    { label: 'Reuniões',        value: meetings.length, icon: <Video className="w-4 h-4" />, color: '#06b6d4', border: 'border-cyan-500/20'     },
    { label: 'Clientes Ativos', value: clients,   icon: <Users className="w-4 h-4" />,    color: '#8b5cf6', border: 'border-violet-500/20'  },
    { label: 'Concluídas',      value: done,      icon: <TrendingUp className="w-4 h-4" />, color: '#10b981', border: 'border-emerald-500/20' },
  ]

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className={cn('glass-card p-4 border', s.border)}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-2xl font-bold text-white tabular-nums">{s.value}</span>
            </div>
            <p className="text-[11px] text-white/40 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35 }}
        className="glass-card border border-white/[0.07] px-5 py-3.5 flex items-center gap-4"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-semibold text-white/70">Progresso do Dia</span>
          <span className="text-sm font-bold tabular-nums" style={{
            color: pct === 100 ? '#10b981' : pct >= 50 ? '#6366f1' : '#f59e0b'
          }}>
            {done}/{total}
          </span>
        </div>

        <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: pct === 100
                ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            }}
          />
        </div>

        <span className="text-sm font-bold text-white/60 tabular-nums shrink-0">{pct}%</span>
      </motion.div>
    </div>
  )
}
