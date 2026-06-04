'use client'

import Link from 'next/link'
import { Video, Clock, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, REGION_CONFIG, getTodayISO } from '@/store/daily'
import { useI18nStore } from '@/store/i18n'

export function DailyMeetingsWidget() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const allMeetings = useDailyStore(s => s.allMeetings)
  const todayISO = getTodayISO()
  const meetings = allMeetings.filter(m => (m.date ?? todayISO) === todayISO)

  const now    = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const sorted = [...meetings].sort((a, b) => a.time.localeCompare(b.time))

  const next = sorted.find(m => {
    const [h, min] = m.time.split(':').map(Number)
    return h * 60 + min >= nowMin
  })

  return (
    <div className="glass-card border border-white/[0.07] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
            <Video className="w-3 h-3 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-white/85">{t('todayMeetings')}</h3>
        </div>
        <Link href="/calendar" className="flex items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-medium text-cyan-300 hover:bg-cyan-500/15">
          <CalendarDays className="w-3 h-3" />
          {t('agenda')}
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-white/25 italic">{t('noMeetingsToday')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sorted.map(m => {
              const rCfg = REGION_CONFIG[m.region]
              const [h, min] = m.time.split(':').map(Number)
              const isPast   = h * 60 + min < nowMin
              const isNext   = next?.id === m.id

              return (
                <div
                  key={m.id}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-all',
                    isPast
                      ? 'border-white/[0.03] bg-transparent opacity-30'
                      : isNext
                        ? 'border-cyan-400/20 bg-cyan-400/5'
                        : 'border-white/[0.05] bg-white/[0.02]'
                  )}
                >
                  <span className="text-base leading-none shrink-0">{rCfg?.flag ?? '🌐'}</span>
                  <span className="text-[12px] font-mono font-semibold text-white/70 tabular-nums shrink-0">
                    {m.time}
                  </span>
                  <span className="text-[12px] text-white/50 truncate flex-1">
                    {m.title ?? m.region}
                  </span>
                  {isNext && (
                    <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">
                      {t('nextMeeting').toUpperCase()}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer — próxima reunião */}
      {next && (
        <div className="px-4 py-2.5 border-t border-white/[0.05] shrink-0 flex items-center gap-1.5 text-white/35">
          <Clock className="w-3 h-3" />
          <span className="text-[10px]">{t('nextMeeting')}: {next.time} - {next.title ?? next.region}</span>
        </div>
      )}
    </div>
  )
}
