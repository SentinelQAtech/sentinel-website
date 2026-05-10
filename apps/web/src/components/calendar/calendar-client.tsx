'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Clock, X, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useCalendarStore,
  EVENT_TYPE_CONFIG, REGION_CONFIG,
  CalendarEvent,
} from '@/store/calendar'
import { AddEventModal } from './add-event-modal'

const WEEKDAYS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isToday(date: Date) {
  const t = new Date()
  return date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
}

function buildGrid(year: number, month: number) {
  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevTotal   = new Date(year, month, 0).getDate()

  const cells: { date: Date; inMonth: boolean }[] = []

  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, prevTotal - i), inMonth: false })

  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), inMonth: true })

  const remainder = cells.length % 7
  if (remainder > 0)
    for (let d = 1; d <= 7 - remainder; d++)
      cells.push({ date: new Date(year, month + 1, d), inMonth: false })

  return cells
}

export function CalendarClient() {
  const today = new Date()
  const [year,         setYear]         = useState(today.getFullYear())
  const [month,        setMonth]        = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(toISO(today))
  const [addOpen,      setAddOpen]      = useState(false)
  const [prefillDate,  setPrefillDate]  = useState('')
  const [showHistory,  setShowHistory]  = useState(false)

  const { events, removeEvent } = useCalendarStore()

  const cells = useMemo(() => buildGrid(year, month), [year, month])

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  const selectedEvents = useMemo(
    () => (eventsByDate[selectedDate] ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [eventsByDate, selectedDate]
  )

  const historyEvents = useMemo(() => {
    const todayISO = toISO(today)
    return events
      .filter(e => e.date < todayISO)
      .sort((a, b) => `${b.date}T${b.startTime}`.localeCompare(`${a.date}T${a.startTime}`))
  }, [events, today])

  const prevMonth = () => month === 0  ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)
  const nextMonth = () => month === 11 ? (setMonth(0),  setYear(y => y + 1)) : setMonth(m => m + 1)
  const goToday   = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDate(toISO(today)) }

  const openAdd = (date: string) => { setPrefillDate(date); setAddOpen(true) }
  const jumpToDate = (date: string) => {
    const target = new Date(date + 'T12:00:00')
    setYear(target.getFullYear())
    setMonth(target.getMonth())
    setSelectedDate(date)
    setShowHistory(false)
  }

  return (
    <div className="flex gap-5 h-full min-h-0">
      {/* ── Calendar main ── */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden min-h-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold text-white w-44 text-center">
              {MONTHS_PT[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all duration-150"
            >
              Hoje
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(v => !v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                showHistory
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/75'
              )}
            >
              <History className="w-3.5 h-3.5" />
              Historico
            </button>
            <button
              onClick={() => openAdd(selectedDate)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Evento
            </button>
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-white/[0.06] shrink-0">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-white/30">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="flex-1 grid grid-cols-7 overflow-y-auto" style={{ gridAutoRows: 'minmax(90px, 1fr)' }}>
          {cells.map((cell, idx) => {
            const iso       = toISO(cell.date)
            const dayEvents = eventsByDate[iso] ?? []
            const isSelected = iso === selectedDate
            const isCurrent  = isToday(cell.date)
            const maxShown   = 3
            const extra      = dayEvents.length - maxShown

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(iso)}
                className={cn(
                  'border-r border-b border-white/[0.04] p-1.5 cursor-pointer transition-colors duration-100',
                  'hover:bg-white/[0.02]',
                  !cell.inMonth && 'opacity-25',
                  isSelected   && 'bg-primary/[0.06] ring-inset ring-1 ring-primary/20',
                )}
              >
                {/* Day number */}
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 ml-0.5',
                  isCurrent    ? 'bg-primary text-white'     : 'text-white/55',
                  isSelected && !isCurrent && 'bg-white/10 text-white',
                )}>
                  {cell.date.getDate()}
                </div>

                {/* Event pills */}
                <div className="space-y-0.5">
                  {dayEvents.slice(0, maxShown).map(ev => {
                    const cfg = EVENT_TYPE_CONFIG[ev.type]
                    return (
                      <div
                        key={ev.id}
                        className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium leading-tight"
                        style={{ backgroundColor: cfg.color + '22', color: cfg.color }}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    )
                  })}
                  {extra > 0 && (
                    <p className="text-[10px] px-1 text-white/30">+{extra} mais</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Day detail panel ── */}
      <div className="w-64 shrink-0 flex flex-col glass-card overflow-hidden">
        {/* Panel header */}
        <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-semibold text-white/85">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'short', day: 'numeric', month: 'short',
              })}
            </span>
          </div>
          <button
            onClick={() => openAdd(selectedDate)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {showHistory ? (
            historyEvents.length === 0 ? (
              <div className="text-center pt-10">
                <p className="text-xs text-white/25">Sem eventos anteriores</p>
              </div>
            ) : (
              historyEvents.map(ev => {
                const cfg = EVENT_TYPE_CONFIG[ev.type]
                return (
                  <button
                    key={ev.id}
                    onClick={() => jumpToDate(ev.date)}
                    className="w-full text-left p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-100"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-white/85 leading-snug">{ev.title}</p>
                      <span className="text-[10px] text-white/30 shrink-0">
                        {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-white/35">{ev.startTime} - {ev.endTime}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: cfg.color + '22', color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </button>
                )
              })
            )
          ) : selectedEvents.length === 0 ? (
            <div className="text-center pt-10">
              <p className="text-xs text-white/25">Nenhum evento</p>
              <button
                onClick={() => openAdd(selectedDate)}
                className="mt-3 text-xs text-primary/70 hover:text-primary transition-colors"
              >
                + Adicionar evento
              </button>
            </div>
          ) : (
            selectedEvents.map(ev => {
              const cfg = EVENT_TYPE_CONFIG[ev.type]
              return (
                <div
                  key={ev.id}
                  className="group p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-100"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/85 leading-snug">{ev.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-white/25 shrink-0" />
                        <span className="text-[10px] text-white/35">{ev.startTime} – {ev.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: cfg.color + '22', color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        {ev.region && (
                          <span className="text-[10px] text-white/30">
                            {REGION_CONFIG[ev.region].flag} {REGION_CONFIG[ev.region].label}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeEvent(ev.id)}
                      className="opacity-0 group-hover:opacity-100 mt-0.5 text-white/20 hover:text-red-400 transition-all duration-150 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-white/[0.06] shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-2">Legenda</p>
          <div className="flex flex-col gap-1">
            {(Object.entries(EVENT_TYPE_CONFIG) as [string, { label: string; color: string }][]).map(([, cfg]) => (
              <div key={cfg.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="text-[10px] text-white/40">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddEventModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultDate={prefillDate}
      />
    </div>
  )
}
