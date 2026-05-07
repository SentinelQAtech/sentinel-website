'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { GitBranch } from 'lucide-react'

const SPRINT_POINTS = 80
const SPRINT_DAYS   = 10

const data = Array.from({ length: SPRINT_DAYS + 1 }, (_, i) => {
  const ideal  = Math.round(SPRINT_POINTS - (SPRINT_POINTS / SPRINT_DAYS) * i)
  const noise  = i === 0 ? 0 : Math.floor(Math.random() * 12) - 4
  const actual = i <= 6
    ? Math.max(0, Math.round(SPRINT_POINTS - (SPRINT_POINTS / SPRINT_DAYS) * i * 0.85 + noise))
    : undefined
  return { day: `Dia ${i}`, ideal, actual }
})

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2.5 text-xs space-y-1 min-w-[130px]">
      <p className="font-semibold text-white/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-0.5 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-white">{p.value ?? '—'}</span>
        </div>
      ))}
    </div>
  )
}

export function BurndownChart() {
  return (
    <div className="glass-card border border-white/[0.07] p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/85">Burndown — Sprint 14</h3>
          <p className="text-[10px] text-white/35">{SPRINT_POINTS} pontos · {SPRINT_DAYS} dias</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIdeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.30)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.30)' }}
              axisLine={false}
              tickLine={false}
              domain={[0, SPRINT_POINTS]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ideal"
              name="Ideal"
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="url(#gradIdeal)"
              dot={false}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Real"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#gradActual)"
              dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3 shrink-0">
        {[
          { color: '#6366f1', label: 'Ideal', dashed: true },
          { color: '#8b5cf6', label: 'Real',  dashed: false },
        ].map(({ color, label, dashed }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-white/50">
            <span
              className="w-4 h-0.5 rounded-full"
              style={{
                background: color,
                backgroundImage: dashed ? `repeating-linear-gradient(90deg,${color} 0,${color} 4px,transparent 4px,transparent 7px)` : undefined,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
