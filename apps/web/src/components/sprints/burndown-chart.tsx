'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface BurndownChartProps {
  sprintName: string
  planned: number
}

export function BurndownChart({ sprintName, planned }: BurndownChartProps) {
  // Ideal burndown + actual progress
  const data = [
    { day: 'Day 1',  ideal: 42, actual: 42 },
    { day: 'Day 2',  ideal: 37, actual: 38 },
    { day: 'Day 3',  ideal: 32, actual: 33 },
    { day: 'Day 4',  ideal: 27, actual: 30 },
    { day: 'Day 5',  ideal: 22, actual: 26 },
    { day: 'Day 6',  ideal: 17, actual: 22 },
    { day: 'Day 7',  ideal: 12, actual: 18 },
    { day: 'Day 8',  ideal: 7,  actual: 14 },
    { day: 'Today',  ideal: 4,  actual: 14, isToday: true },
    { day: 'Day 10', ideal: 0,  actual: null },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass-card px-4 py-3 text-xs space-y-1.5">
        <p className="font-semibold text-white/70">{label}</p>
        {payload.map((p: any) => p.value !== null && (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-medium text-white">{p.value} pts remaining</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burndown — {sprintName}</CardTitle>
        <span className="text-xs text-white/40">{planned} story points</span>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="ideal" name="Ideal"
              stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
              strokeDasharray="6 4" dot={false}
            />
            <Line
              type="monotone" dataKey="actual" name="Actual"
              stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-5 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-5 h-px border-t border-dashed border-white/30" />
            Ideal
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-4 h-0.5 rounded bg-primary" />
            Actual
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
