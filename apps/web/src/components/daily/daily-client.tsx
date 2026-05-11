'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus, Video, RefreshCw, Sun, Filter, CalendarDays,
  AlertTriangle, ChevronLeft, ChevronRight, History, Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, DEFAULT_CLIENTS, PRIORITY_CONFIG, CLIENT_CONFIG, getTodayISO, type DailyPriority } from '@/store/daily'
import { useI18nStore } from '@/store/i18n'
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
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const {
    tasks,
    meetings,
    selectedDate,
    setSelectedDate,
    goToToday,
    getDailyDates,
    copyOpenTasksToToday,
    generateTemplate,
  } = useDailyStore()

  const [addItem,    setAddItem]    = useState(false)
  const [addMeeting, setAddMeeting] = useState(false)
  const [view,       setView]       = useState<ViewMode>('client')
  const [historyOpen, setHistoryOpen] = useState(false)

  // Gather all unique clients (default + any custom)
  const clientsWithTasks = [...new Set([...DEFAULT_CLIENTS, ...tasks.map(t => t.client)])]
    .filter(c => tasks.some(t => t.client === c))
  const selected = new Date(`${selectedDate}T12:00:00`)
  const todayISO = getTodayISO()
  const isToday = selectedDate === todayISO
  const dailyDates = getDailyDates()
  const openTasks = tasks.filter(t => t.status !== 'done')
  const dateStr = selected.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const shiftDay = (delta: number) => {
    const next = new Date(`${selectedDate}T12:00:00`)
    next.setDate(next.getDate() + delta)
    setSelectedDate(next.toISOString().slice(0, 10))
  }

  const copyOpenToToday = () => {
    const copied = copyOpenTasksToToday(selectedDate)
    if (copied > 0) goToToday()
  }

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
            <h1 className="text-2xl font-bold text-white">{t('dailyTitle')}</h1>
          </div>
          <p className="text-sm text-white/40 ml-10.5 capitalize">{dateStr}</p>
          <p className="text-xs text-white/30 ml-10.5 mt-0.5">
            {isToday ? t('dailyTodayHint') : t('dailyHistoryHint')}
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
            <span className="hidden sm:block">{t('generateTemplate')}</span>
          </button>
          {!isToday && openTasks.length > 0 && (
            <button
              onClick={copyOpenToToday}
              title="Copiar tarefas abertas desta data para o Daily atual"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
                'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300',
                'hover:bg-emerald-500/15 transition-all duration-150'
              )}
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Enviar abertas para hoje</span>
            </button>
          )}
          <button
            onClick={() => setAddMeeting(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
              'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400',
              'hover:bg-cyan-500/15 transition-all duration-150'
            )}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:block">{t('meeting')}</span>
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
            <span className="hidden sm:block">{t('task')}</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{ transitionDelay: '40ms' }}
        className="glass-card border border-white/[0.07] p-3"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => shiftDay(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/45 hover:text-white/70"
              title={t('previousDaily')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm font-medium text-white outline-none"
            />
            <button
              onClick={() => shiftDay(1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/45 hover:text-white/70"
              title={t('nextDaily')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className={cn(
                'h-9 rounded-lg border px-3 text-xs font-semibold transition-colors',
                isToday
                  ? 'border-primary/35 bg-primary/15 text-primary'
                  : 'border-white/[0.08] bg-white/[0.04] text-white/45 hover:text-white/70'
              )}
            >
              {t('today')}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHistoryOpen(o => !o)}
              className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-medium text-white/55 hover:text-white/75"
            >
              <History className="w-3.5 h-3.5" />
              {t('history')}
            </button>
            {!isToday && (
              <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                Visualizando Daily anterior
              </span>
            )}
          </div>
        </div>

        {historyOpen && (
          <div className="mt-3 flex gap-2 overflow-x-auto border-t border-white/[0.06] pt-3">
            {dailyDates.map(date => {
              const dt = new Date(`${date}T12:00:00`)
              const label = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left text-xs transition-colors shrink-0',
                    selectedDate === date
                      ? 'border-primary/35 bg-primary/15 text-primary'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/45 hover:text-white/70'
                  )}
                >
                  <span className="block font-semibold">{date === todayISO ? t('today') : label}</span>
                  <span className="block text-[10px] opacity-60">{date}</span>
                </button>
              )
            })}
          </div>
        )}
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
            { id: 'client',   label: t('byClient'),   icon: <Filter className="w-3 h-3" /> },
            { id: 'priority', label: t('byPriority'), icon: <Target className="w-3 h-3" /> },
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
                <h3 className="text-sm font-semibold text-white/80">{t('todayMeetings')}</h3>
              </div>
              <Link
                href="/calendar"
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/15"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {t('agenda')}
              </Link>
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
