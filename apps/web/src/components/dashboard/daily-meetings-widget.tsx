'use client'

import { Video, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDailyStore, REGION_CONFIG } from '@/store/daily'

export function DailyMeetingsWidget() {
  const meetings = useDailyStore(s => s.meetings)

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
          <h3 className="text-sm font-semibold text-white/85">Reuniões de Hoje</h3>
        </div>
        <span className="text-[10px] text-white/30 shrink-0">
          {sorted.length} {sorted.length === 1 ? 'reunião' : 'reuniões'}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-white/25 italic">Sem reuniões hoje</p>
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
                      PRÓXIMA
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
          <span className="text-[10px]">Próxima: {next.time} — {next.title ?? next.region}</span>
        </div>
      )}
    </div>
  )
}
