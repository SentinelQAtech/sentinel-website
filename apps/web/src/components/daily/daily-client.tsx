'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Video, RefreshCw, Sun, Filter,
  AlertTriangle, ChevronRight, Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, DEFAULT_CLIENTS, PRIORITY_CONFIG, CLIENT_CONFIG, type DailyPriority } from '@/store/daily'
import { DailyOverview } from './daily-overview'
import { ClientSection } from './client-section'
import { MeetingsPanel } from './meetings-panel'
import { AddItemModal } from './add-item-modal'
import { AddMeetingModal } from './add-meeting-modal'

type ViewMode = 'client' | 'priority'

const PRIORITY_ORDER: DailyPriority[] = ['Critical', 'High', 'Medium', 'Low']

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export function DailyClient() {
  const { tasks, meetings, generateTemplate } = useDailyStore()

  const [addItem,    setAddItem]    = useState(false)
  const [addMeeting, setAddMeeting] = useState(false)
  const [view,       setView]       = useState<ViewMode>('client')

  // Gather all unique clients (default + any custom)
  const clientsWithTasks = [...new Set([...DEFAULT_CLIENTS, ...tasks.map(t => t.client)])]
    .filter(c => tasks.some(t => t.client === c))
  const today  = new Date()
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <>
      {/* Page header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Sun className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">Daily Command Center</h1>
          </div>
          <p className="text-sm text-white/40 ml-10.5 capitalize">{dateStr}</p>
          <p className="text-xs text-white/30 ml-10.5 mt-0.5">
            Planeje, priorize e acompanhe o trabalho de hoje.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generateTemplate}
            title="Gerar template padrão do dia"
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
              'bg-white/[0.04] border border-white/[0.08] text-white/50',
              'hover:bg-white/[0.07] hover:text-white/70 transition-all duration-150'
            )}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Gerar Template</span>
          </button>
          <button
            onClick={() => setAddMeeting(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
              'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400',
              'hover:bg-cyan-500/15 transition-all duration-150'
            )}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:block">+ Reunião</span>
          </button>
          <button
            onClick={() => setAddItem(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold',
              'bg-primary/20 border border-primary/30 text-primary',
              'hover:bg-primary/30 transition-all duration-150'
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:block">+ Tarefa</span>
          </button>
        </div>
      </motion.div>

      {/* Overview + Progress */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ transitionDelay: '60ms' }}>
        <DailyOverview />
      </motion.div>

      {/* View toggle */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{ transitionDelay: '120ms' }}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          {([
            { id: 'client',   label: 'Por Cliente',   icon: <Filter className="w-3 h-3" /> },
            { id: 'priority', label: 'Por Prioridade', icon: <Target className="w-3 h-3" /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                view === tab.id
                  ? 'bg-white/[0.10] text-white border border-white/[0.12]'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-white/25">{tasks.length} tarefas · {meetings.length} reuniões</span>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{ transitionDelay: '180ms' }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* Left: Tasks */}
        <div className="lg:col-span-2 space-y-3">
          {view === 'client' ? (
            /* By client */
            clientsWithTasks.map(client => (
              <ClientSection
                key={client}
                client={client}
                tasks={tasks.filter(t => t.client === client)}
              />
            ))
          ) : (
            /* By priority */
            PRIORITY_ORDER.map(priority => {
              const pTasks = tasks.filter(t => t.priority === priority && t.status !== 'done')
              if (pTasks.length === 0) return null
              const cfg = PRIORITY_CONFIG[priority]
              return (
                <div key={priority} className="rounded-xl border border-white/[0.07] overflow-hidden">
                  <div
                    className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.07]"
                    style={{ backgroundColor: cfg.color + '08' }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    <span className="text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="text-xs text-white/30 ml-auto">{pTasks.length} tarefas</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {pTasks.map(task => {
                      const clientCfg = CLIENT_CONFIG[task.client]
                      return (
                        <div key={task.id} className="relative">
                          <div
                            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
                            style={{ backgroundColor: clientCfg?.color ?? '#6366f1' }}
                          />
                          <div className="pl-3">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-semibold" style={{ color: clientCfg?.color ?? '#6366f1' }}>
                                {task.client}
                              </span>
                              <ChevronRight className="w-2.5 h-2.5 text-white/20" />
                            </div>
                            {/* Reuse TaskCard inline */}
                            <div className="text-sm text-white/75">{task.title}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Right: Meetings + High Priority sidebar */}
        <div className="space-y-4">
          {/* Meetings */}
          <div className="glass-card border border-white/[0.07] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white/80">Reuniões de Hoje</h3>
              </div>
              <span className="text-xs text-white/30">{meetings.length} total</span>
            </div>
            <MeetingsPanel />
          </div>

          {/* Done summary */}
          {tasks.filter(t => t.status === 'done').length > 0 && (
            <div className="glass-card border border-emerald-500/15 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">✓</span>
                </div>
                <h3 className="text-sm font-semibold text-emerald-400">
                  Concluídas ({tasks.filter(t => t.status === 'done').length})
                </h3>
              </div>
              <div className="space-y-1">
                {tasks.filter(t => t.status === 'done').map(t => (
                  <p key={t.id} className="text-xs text-white/30 line-through truncate">{t.title}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AddItemModal    open={addItem}    onClose={() => setAddItem(false)}    />
      <AddMeetingModal open={addMeeting} onClose={() => setAddMeeting(false)} />
    </>
  )
}
