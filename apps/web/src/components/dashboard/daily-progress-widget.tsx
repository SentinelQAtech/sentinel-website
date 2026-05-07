'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sun, ArrowRight } from 'lucide-react'
import { useDailyStore } from '@/store/daily'

export function DailyProgressWidget() {
  const tasks = useDailyStore(s => s.tasks)

  const total = tasks.length
  const done  = tasks.filter(t => t.status === 'done').length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="glass-card border border-white/[0.07] overflow-hidden h-full flex flex-col">
      <div className="h-px w-full bg-gradient-to-r from-primary/60 via-violet-500/40 to-transparent shrink-0" />

      <div className="flex flex-col gap-4 px-5 py-4 flex-1 justify-between">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <Sun className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/85 leading-none">Daily — Progresso</h3>
            <p className="text-[10px] text-white/35 mt-0.5">{done} de {total} tarefas concluídas</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30">Conclusão</span>
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
          {/* Dot progress */}
          {total > 0 && total <= 20 && (
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ background: i < done ? '#6366f1' : 'rgba(255,255,255,0.08)' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action */}
        <Link
          href="/daily"
          className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-medium bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 transition-all duration-150"
        >
          Abrir Daily <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
