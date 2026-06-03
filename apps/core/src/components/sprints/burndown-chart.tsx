'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface BurndownChartProps {
  sprintName: string
  planned: number
}

export function BurndownChart({ sprintName, planned }: BurndownChartProps) {
  const totalDays = 10
  const data = Array.from({ length: totalDays }, (_, index) => {
    const remainingDays = totalDays - 1 - index
    return {
      day: index === 0 ? 'Day 1' : index === totalDays - 1 ? 'Final' : `Day ${index + 1}`,
      ideal: Math.round((planned * remainingDays) / (totalDays - 1)),
      actual: null,
    }
  })

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
