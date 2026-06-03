'use client'

import Link from 'next/link'
import { ClipboardList, CheckCircle2, Circle, AlertCircle, Minus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, PRIORITY_CONFIG, CLIENT_CONFIG, getTodayISO } from '@/store/daily'
import type { DailyStatus } from '@/store/daily'

const STATUS_ICON: Record<DailyStatus, { icon: React.ElementType; cls: string }> = {
  done:        { icon: CheckCircle2, cls: 'text-emerald-400' },
  in_progress: { icon: Minus,       cls: 'text-indigo-400'  },
  blocked:     { icon: AlertCircle, cls: 'text-red-400'      },
  todo:        { icon: Circle,      cls: 'text-white/20'     },
}

export function DailyTasksWidget() {
  const { getTasksForDate } = useDailyStore()
  const tasks = getTasksForDate(getTodayISO())

  const sorted = [...tasks].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    if (a.status === 'done' && b.status !== 'done') return 1
    if (a.status !== 'done' && b.status === 'done') return -1
    return (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
  })

  const done  = tasks.filter(t => t.status === 'done').length
  const total = tasks.length

  return (
    <div className="glass-card border border-white/[0.07] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <ClipboardList className="w-3 h-3 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-white/85">Tarefas de Hoje</h3>
          {total > 0 && (
            <span className="text-[10px] text-white/30">
              {done}/{total}
            </span>
          )}
        </div>
        <Link
          href="/daily"
          className="flex items-center gap-1 text-[10px] text-white/30 hover:text-primary transition-colors shrink-0"
        >
          Ver Daily
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-white/25 italic">Nenhuma tarefa para hoje</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {sorted.map(task => {
              const pCfg  = PRIORITY_CONFIG[task.priority]
              const cCfg  = CLIENT_CONFIG[task.client]
              const sIcon = STATUS_ICON[task.status]
              const Icon  = sIcon.icon
              const isDone = task.status === 'done'

              return (
                <Link
                  key={task.id}
                  href="/daily"
                  title="Abrir no Daily"
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
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
