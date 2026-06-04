'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Trash2, Loader2, Ban, ExternalLink } from 'lucide-react'
import { cn, sanitizeTitle } from '@/lib/utils'
import {
  useDailyStore,
  PRIORITY_CONFIG, TYPE_CONFIG, STATUS_CONFIG,
  type DailyTask, type DailyStatus,
} from '@/store/daily'

interface TaskCardProps {
  task: DailyTask
}

const statusCycle: DailyStatus[] = ['todo', 'in_progress', 'done', 'blocked']

function parseNotes(notes?: string): { link: string | null; text: string } {
  if (!notes) return { link: null, text: '' }
  const match = notes.match(/🔗\s*(https?:\/\/\S+)/)
  return {
    link: match ? match[1] : null,
    text: notes.replace(/\s*·?\s*🔗\s*https?:\/\/\S+/, '').trim(),
  }
}


export function TaskCard({ task }: TaskCardProps) {
  const { toggleTask, removeTask, updateTask } = useDailyStore()
  const [expanded, setExpanded] = useState(false)

  const title    = sanitizeTitle(task.title)
  const done     = task.status === 'done'
  const blocked  = task.status === 'blocked'
  const priority = PRIORITY_CONFIG[task.priority]
  const typeConf = TYPE_CONFIG[task.type]
  const status   = STATUS_CONFIG[task.status]

  const { link, text: cleanNotes } = parseNotes(task.notes)

  const cycleStatus = () => {
    const idx  = statusCycle.indexOf(task.status)
    const next = statusCycle[(idx + 1) % statusCycle.length]
    updateTask(task.id, { status: next })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: done ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex flex-col gap-0 rounded-lg border transition-all duration-200',
        'bg-white/[0.02] border-white/[0.07]',
        'hover:bg-white/[0.04] hover:border-white/[0.12]',
        done && 'opacity-50',
        blocked && 'border-red-500/20 bg-red-500/[0.02]'
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Toggle checkbox */}
        <button
          onClick={() => toggleTask(task.id)}
          className={cn(
            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0',
            'transition-all duration-150',
            done
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-white/20 hover:border-white/40 bg-transparent'
          )}
        >
          {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Title — clicável para expandir */}
        <button
          onClick={() => setExpanded(o => !o)}
          className={cn(
            'flex-1 text-sm leading-snug text-left transition-all duration-200',
            done ? 'line-through text-white/30' : 'text-white/80',
            blocked && 'text-red-400/70'
          )}
        >
          {title}
        </button>

        {/* Badges row */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Type */}
          <span
            className="hidden sm:block text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08]"
            style={{ color: typeConf.color }}
          >
            {task.type}
          </span>

          {/* Priority dot */}
          <span
            className={cn('px-1.5 py-0.5 rounded-md text-[10px] font-semibold border', priority.bg, priority.border)}
            style={{ color: priority.color }}
          >
            {task.priority[0]}
          </span>

          {/* Status cycle button */}
          <button
            onClick={cycleStatus}
            title={`Status: ${status.label} — clique para avançar`}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] transition-colors duration-150"
            style={{ color: status.color }}
          >
            {task.status === 'in_progress' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            {task.status === 'blocked'     && <Ban className="w-2.5 h-2.5" />}
            <span className="hidden sm:block">{status.label}</span>
          </button>

          {/* Expand chevron */}
          <button
            onClick={() => setExpanded(o => !o)}
            className="p-1 rounded text-white/25 hover:text-white/50 transition-colors duration-150"
          >
            <ChevronDown className={cn('w-3 h-3 transition-transform duration-150', expanded && 'rotate-180')} />
          </button>

          {/* Delete */}
          <button
            onClick={() => removeTask(task.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/20 hover:text-red-400 transition-all duration-150"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-white/[0.05] pt-2.5 space-y-2">
              {cleanNotes && (
                <p className="text-xs text-white/40 leading-relaxed">{cleanNotes}</p>
              )}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                    'bg-primary/15 border border-primary/30 text-primary',
                    'hover:bg-primary/25 transition-all duration-150'
                  )}
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir card no Jira
                </a>
              )}
              {!link && !cleanNotes && (
                <p className="text-xs text-white/20 italic">Nenhum detalhe disponível</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
