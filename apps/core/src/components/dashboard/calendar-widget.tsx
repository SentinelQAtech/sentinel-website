'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { CalendarDays, Clock, ArrowRight, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useCalendarStore, EVENT_TYPE_CONFIG } from '@/store/calendar'

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function CalendarWidget() {
  const { events } = useCalendarStore()
  const today = new Date()
  const todayISO = toISO(today)

  const todayEvents = useMemo(
    () => events
      .filter(e => e.date === todayISO)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events, todayISO]
  )

  const upcomingEvent = useMemo(() => {
    const nowTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
    return todayEvents.find(e => e.startTime > nowTime) ?? null
  }, [todayEvents, today])

  const dateLabel = today.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <CardTitle>Calendário</CardTitle>
        </div>
        <Link
          href="/calendar"
          className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors duration-150"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-2 flex-1">
        {/* Today date chip */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40 capitalize">{dateLabel}</p>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25">
            {todayEvents.length} evento{todayEvents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Next event highlight */}
        {upcomingEvent ? (
          <div
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: EVENT_TYPE_CONFIG[upcomingEvent.type].color + '12',
              borderColor:     EVENT_TYPE_CONFIG[upcomingEvent.type].color + '35',
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: EVENT_TYPE_CONFIG[upcomingEvent.type].color }}>
              Próximo
            </p>
            <p className="text-sm font-medium text-white/85 leading-snug">{upcomingEvent.title}</p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" style={{ color: EVENT_TYPE_CONFIG[upcomingEvent.type].color + 'aa' }} />
              <span className="text-xs text-white/45">{upcomingEvent.startTime} – {upcomingEvent.endTime}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-xs text-white/25">Sem próximos eventos hoje</p>
          </div>
        )}

        {/* Event list */}
        <div className="flex flex-col gap-1.5 flex-1">
          {todayEvents.length === 0 ? (
            <p className="text-xs text-white/25 text-center py-4">Nenhum evento hoje</p>
          ) : (
            todayEvents.map(ev => {
              const cfg = EVENT_TYPE_CONFIG[ev.type]
              const isPast = ev.endTime < `${String(today.getHours()).padStart(2,'0')}:${String(today.getMinutes()).padStart(2,'0')}`
              return (
                <div
                  key={ev.id}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-white/[0.04]',
                    'hover:bg-white/[0.03] transition-colors duration-100',
                    isPast && 'opacity-40'
                  )}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/75 truncate">{ev.title}</p>
                  </div>
                  <span className="text-[10px] text-white/30 shrink-0 tabular-nums">{ev.startTime}</span>
                </div>
              )
            })
          )}
        </div>

        {/* Add event CTA */}
        <Link
          href="/calendar"
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 rounded-lg',
            'border border-dashed border-white/10 text-xs text-white/30',
            'hover:border-primary/30 hover:text-primary/70 transition-all duration-200'
          )}
        >
          <Plus className="w-3 h-3" />
          Adicionar evento
        </Link>
      </CardContent>
    </Card>
  )
}
