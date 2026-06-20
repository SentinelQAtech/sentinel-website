'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus, Video, Sun, CalendarDays,
  ChevronLeft, ChevronRight, History,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTodayISO } from '@/store/daily'
import { useI18nStore } from '@/store/i18n'
import { useAllDailyTasks, useDailyMeetings } from '@/hooks/useDaily'
import { DailyOverview } from './daily-overview'
import { MeetingsPanel } from './meetings-panel'
import { AddItemModal } from './add-item-modal'
import { AddMeetingModal } from './add-meeting-modal'
import { QADailyCockpit } from './qa-daily-cockpit'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export function DailyClient() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  const todayISO = getTodayISO()
  const [selectedDate, setSelectedDate] = useState(todayISO)
  const [addItem,     setAddItem]     = useState(false)
  const [addMeeting,  setAddMeeting]  = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const { tasks: allTasks } = useAllDailyTasks()
  const { data: allMeetings = [] } = useDailyMeetings()

  // Dates that actually have Daily activity (tasks or meetings) + today.
  const dailyDates = useMemo(() => {
    const dates = new Set<string>([todayISO])
    allTasks.forEach(task => { if (task.date) dates.add(task.date) })
    allMeetings.forEach(m => { if (m.date) dates.add(m.date) })
    return [...dates].sort((a, b) => b.localeCompare(a))
  }, [allTasks, allMeetings, todayISO])

  const selected = new Date(`${selectedDate}T12:00:00`)
  const isToday = selectedDate === todayISO
  const dateStr = selected.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const shiftDay = (delta: number) => {
    const next = new Date(`${selectedDate}T12:00:00`)
    next.setDate(next.getDate() + delta)
    setSelectedDate(next.toISOString().slice(0, 10))
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

      {/* Date navigation */}
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
              className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm font-medium text-white outline-none [color-scheme:dark]"
            />
            <button
              onClick={() => shiftDay(1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/45 hover:text-white/70"
              title={t('nextDaily')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(todayISO)}
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
                {t('viewingPreviousDaily')}
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

      {/* Overview */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ transitionDelay: '60ms' }}>
        <DailyOverview date={selectedDate} />
      </motion.div>

      {/* Tasks for the day (single source: QA items sent to Daily) */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ transitionDelay: '90ms' }}>
        <QADailyCockpit selectedDate={selectedDate} />
      </motion.div>

      {/* Meetings */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{ transitionDelay: '120ms' }}
        className="glass-card border border-white/[0.07] p-4"
      >
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
        <MeetingsPanel date={selectedDate} />
      </motion.div>

      {/* Modals */}
      <AddItemModal    open={addItem}    onClose={() => setAddItem(false)} selectedDate={selectedDate} />
      <AddMeetingModal open={addMeeting} onClose={() => setAddMeeting(false)} selectedDate={selectedDate} />
    </>
  )
}
