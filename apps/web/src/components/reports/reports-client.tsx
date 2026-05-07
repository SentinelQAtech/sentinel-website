'use client'

import { BarChart2, TrendingUp, Clock, Users, Download, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const velocityData = [
  { sprint: 'S10', planned: 38, completed: 32 },
  { sprint: 'S11', planned: 42, completed: 39 },
  { sprint: 'S12', planned: 40, completed: 40 },
  { sprint: 'S13', planned: 45, completed: 41 },
  { sprint: 'S14', planned: 42, completed: 28 },
]

const teamRadar = [
  { subject: 'Velocity',    A: 85 },
  { subject: 'Quality',     A: 92 },
  { subject: 'Bug Rate',    A: 78 },
  { subject: 'Coverage',    A: 88 },
  { subject: 'On-time',     A: 74 },
  { subject: 'Throughput',  A: 90 },
]

const resolutionData = [
  { week: 'W1', bugs: 12, avgDays: 3.2 },
  { week: 'W2', bugs: 8,  avgDays: 2.8 },
  { week: 'W3', bugs: 15, avgDays: 3.9 },
  { week: 'W4', bugs: 6,  avgDays: 2.1 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-3 text-xs space-y-1.5 min-w-[140px]">
      <p className="font-semibold text-white/70">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ReportsClient() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-cyan-400" /> Reports
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Operational insights and team analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
            Generate Report
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export
          </Button>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Sprint Velocity', value: '40.4 pts', delta: '+8%', icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-400' },
          { label: 'Bug Resolution Time', value: '3.2 days',  delta: '-15%', icon: <Clock className="w-4 h-4" />,      color: 'text-cyan-400'    },
          { label: 'Team Efficiency',     value: '87%',       delta: '+5%',  icon: <Users className="w-4 h-4" />,      color: 'text-violet-400'  },
          { label: 'Test Coverage',       value: '88%',       delta: '+3%',  icon: <BarChart2 className="w-4 h-4" />,  color: 'text-amber-400'   },
        ].map(({ label, value, delta, icon, color }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">{label}</span>
              <span className={color}>{icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-xs mt-1 ${delta.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {delta} vs prev period
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Velocity chart */}
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader>
            <CardTitle>Sprint Velocity</CardTitle>
            <span className="text-xs text-white/40">Last 5 sprints</span>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={velocityData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="planned"   name="Planned"   fill="rgba(99,102,241,0.3)"  radius={[4,4,0,0]} />
                <Bar dataKey="completed" name="Completed" fill="rgba(99,102,241,0.85)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team radar */}
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <span className="text-xs text-white/40">Sprint 14</span>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.45)' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Team" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bug resolution time */}
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader>
            <CardTitle>Bug Resolution Time</CardTitle>
            <span className="text-xs text-white/40">Avg days per week</span>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={resolutionData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgDays" name="Avg Days" fill="#06b6d4" radius={[4,4,0,0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity table */}
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader>
            <CardTitle>Team Productivity</CardTitle>
            <span className="text-xs text-white/40">Sprint 14</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {[
                { name: 'Raphael Castilho', tasks: 12, bugs: 3, points: 28, pct: 92 },
                { name: 'Antonio Silva',    tasks: 10, bugs: 2, points: 22, pct: 85 },
                { name: 'Maria Santos',     tasks: 8,  bugs: 5, points: 18, pct: 78 },
                { name: 'João Lima',        tasks: 7,  bugs: 1, points: 15, pct: 71 },
                { name: 'Carlos Mendes',    tasks: 9,  bugs: 2, points: 20, pct: 88 },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white/75">{m.name}</span>
                      <span className="text-xs text-white/40">{m.points}pts</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-white/60 w-9 text-right">{m.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
