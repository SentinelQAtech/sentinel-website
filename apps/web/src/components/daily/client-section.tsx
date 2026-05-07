'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CLIENT_CONFIG, type DailyTask } from '@/store/daily'
import { TaskCard } from './task-card'

interface ClientSectionProps {
  client: string
  tasks:  DailyTask[]
  defaultOpen?: boolean
}

export function ClientSection({ client, tasks, defaultOpen = true }: ClientSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const cfg      = CLIENT_CONFIG[client] ?? { color: '#6366f1', short: client.slice(0, 3).toUpperCase() }
  const done     = tasks.filter(t => t.status === 'done').length
  const total    = tasks.length
  const allDone  = done === total && total > 0
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 text-left',
          'bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-150',
          'border-b',
          open ? 'border-white/[0.07]' : 'border-transparent'
        )}
      >
        {/* Client color dot + label */}
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}60` }}
        />
        <span className="text-sm font-semibold text-white/85 flex-1">{client}</span>

        {/* Progress */}
        <div className="flex items-center gap-2 shrink-0">
          {allDone ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className="text-xs text-white/30">
              {done}/{total}
            </span>
          )}

          {/* Mini progress bar */}
          <div className="hidden sm:block w-16 h-1 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: allDone ? '#10b981' : cfg.color }}
            />
          </div>

          <ChevronDown className={cn(
            'w-3.5 h-3.5 text-white/30 transition-transform duration-200',
            open && 'rotate-180'
          )} />
        </div>
      </button>

      {/* Tasks */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-1.5">
              {tasks.length === 0 ? (
                <div className="flex items-center gap-2 py-3 px-1 text-white/30">
                  <Circle className="w-3.5 h-3.5" />
                  <span className="text-xs">Nenhuma tarefa para hoje</span>
                </div>
              ) : (
                tasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
