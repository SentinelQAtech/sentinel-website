'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Ban, CheckCircle2, Clock3, History, Sun } from 'lucide-react'
import { useDailyStore, getTodayISO } from '@/store/daily'

export function DailyProgressWidget() {
  const allTasks = useDailyStore(s => s.allTasks)
  const today = getTodayISO()
  const tasks = allTasks.filter(t => (t.date ?? today) === today)

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const open = tasks.filter(t => t.status !== 'done').length
  const blocked = tasks.filter(t => t.status === 'blocked').length
  const priorityOpen = tasks.filter(t => t.status !== 'done' && (t.priority === 'Critical' || t.priority === 'High')).length
  const activeClients = new Set(tasks.map(t => t.client)).size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // Single pass: accumulate open-task counts per historical date
  const openByDate: Record<string, number> = {}
  for (const t of allTasks) {
    const d = t.date ?? today
    if (d !== today && t.status !== 'done') {
      openByDate[d] = (openByDate[d] ?? 0) + 1
    }
  }
  const previousOpen = Object.entries(openByDate)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, count]) => ({ date, count }))
    .find(item => item.count > 0)

  const stats = [
    { label: 'Abertas', value: open, icon: Clock3, color: '#f59e0b' },
    { label: 'Prioritarias', value: priorityOpen, icon: AlertTriangle, color: '#f97316' },
    { label: 'Bloqueadas', value: blocked, icon: Ban, color: '#ef4444' },
    { label: 'Clientes', value: activeClients, icon: CheckCircle2, color: '#06b6d4' },
  ]

  return (
    <div className="glass-card border border-white/[0.07] overflow-hidden h-full flex flex-col">
      <div className="h-px w-full bg-gradient-to-r from-primary/60 via-violet-500/40 to-transparent shrink-0" />

      <div className="flex flex-col gap-3 px-4 py-3 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <Sun className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/85 leading-none">Daily - Progresso</h3>
            <p className="text-[10px] text-white/35 mt-0.5">{done} de {total} concluidas hoje</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Icon className="w-3 h-3" style={{ color: stat.color }} />
                  <span className="text-sm font-bold text-white tabular-nums">{stat.value}</span>
                </div>
                <p className="mt-0.5 text-[9px] text-white/35">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30">Conclusao</span>
            <span
              className="font-bold tabular-nums"
              style={{ color: pct === 100 ? '#10b981' : '#6366f1' }}
            >
              {pct}%
            </span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
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
        </div>

        {previousOpen && (
          <Link
            href="/daily"
            className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/15"
          >
            <History className="w-3.5 h-3.5" />
            {previousOpen.count} pendente{previousOpen.count > 1 ? 's' : ''} no historico
          </Link>
        )}

        <div className="mt-auto flex gap-2">
          <Link
            href="/daily"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/25 bg-primary/15 px-3 py-2 text-xs font-medium text-primary transition-all duration-150 hover:bg-primary/25"
          >
            Abrir <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/daily"
            className="flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/45 hover:text-white/70"
          >
            Historico
          </Link>
        </div>
      </div>
    </div>
  )
}
