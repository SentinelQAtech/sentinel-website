'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useMemo, useState } from 'react'
import { useBugsStore } from '@/store/bugs'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-3 text-xs space-y-1.5 min-w-[160px]">
      <p className="font-semibold text-white/70 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

type Range = '7d' | '30d' | '90d'

export function BugTrendChart() {
  const [range, setRange] = useState<Range>('30d')
  const bugs = useBugsStore(s => s.bugs)

  const data = useMemo(() => {
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (days - 1 - index))
      const dateKey = date.toISOString().slice(0, 10)
      const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')

      const opened = bugs.filter(bug => bug.createdAt?.slice(0, 10) === dateKey).length
      const resolved = bugs.filter(bug => bug.resolvedAt?.slice(0, 10) === dateKey).length
      const closed = bugs.filter(bug => {
        const updatedKey = bug.updatedAt?.slice(0, 10)
        return updatedKey === dateKey && (bug.status === 'RESOLVED' || bug.status === 'CLOSED')
      }).length

      return { date: label, opened, closed, resolved }
    })
  }, [bugs, range])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bug Trend</CardTitle>
        <div className="flex gap-1">
          {(['7d', '30d', '90d'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                range === r
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradOpened" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradClosed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="opened"   name="Opened"   stroke="#ef4444" fill="url(#gradOpened)"   strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="closed"   name="Closed"   stroke="#10b981" fill="url(#gradClosed)"   strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#6366f1" fill="url(#gradResolved)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-2">
          {[
            { color: '#ef4444', label: 'Opened'   },
            { color: '#10b981', label: 'Closed'   },
            { color: '#6366f1', label: 'Resolved' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-white/50">
              <span className="w-3 h-0.5 rounded-full" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
