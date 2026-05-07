'use client'

import { useMemo } from 'react'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEK_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const WEEKS = 15

function generateData() {
  const today = new Date()
  const cells: { date: string; count: number; day: number }[] = []

  for (let i = WEEKS * 7 - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const isFuture = d > today
    cells.push({
      date:  d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      day:   d.getDay(),
      count: isFuture ? 0 : Math.random() < 0.25 ? 0 : Math.floor(Math.random() * 9),
    })
  }
  return cells
}

function intensityClass(count: number) {
  if (count === 0) return 'bg-white/[0.04]'
  if (count <= 2)  return 'bg-indigo-500/25'
  if (count <= 4)  return 'bg-indigo-500/50'
  if (count <= 6)  return 'bg-violet-500/70'
  return 'bg-violet-400/90'
}

export function ActivityHeatmap() {
  const cells = useMemo(generateData, [])
  const total = cells.reduce((s, c) => s + c.count, 0)

  // Split into weeks (columns)
  const weeks: typeof cells[] = []
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7))
  }

  // Derive month labels per column
  const monthLabels = weeks.map(week => {
    const first = week[0]
    if (!first) return ''
    const [, month] = first.date.split(' ')
    return month ?? ''
  })
  const deduped = monthLabels.map((m, i) => (i === 0 || m !== monthLabels[i - 1] ? m : ''))

  return (
    <div className="glass-card border border-white/[0.07] p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/85">Heatmap de Atividade</h3>
            <p className="text-[10px] text-white/35">{total} ações nas últimas {WEEKS} semanas</p>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-white/30">
          <span>Menos</span>
          {[0, 2, 4, 6, 8].map(v => (
            <span
              key={v}
              className={cn('w-3 h-3 rounded-sm', intensityClass(v))}
            />
          ))}
          <span>Mais</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 pt-4">
            {WEEK_LABELS.map((label, i) => (
              <span key={i} className="h-3 text-[9px] text-white/25 leading-none flex items-center">
                {i % 2 === 0 ? label : ''}
              </span>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {/* Month label */}
              <span className="h-3 text-[9px] text-white/30 leading-none truncate w-8">
                {deduped[wi]}
              </span>
              {/* Day cells */}
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={`${cell.date}: ${cell.count} ações`}
                  className={cn(
                    'w-3 h-3 rounded-sm transition-opacity hover:opacity-80 cursor-default',
                    intensityClass(cell.count)
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
