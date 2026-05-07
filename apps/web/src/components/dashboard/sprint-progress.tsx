'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Zap, Clock, ArrowRight } from 'lucide-react'

const sprints = [
  { name: 'Sprint 14', project: 'SPM Frontend', done: 18, total: 24, daysLeft: 5,  color: '#6366f1', href: '/sprints' },
  { name: 'Sprint 9',  project: 'API Gateway',  done: 12, total: 20, daysLeft: 10, color: '#06b6d4', href: '/sprints' },
  { name: 'Sprint 3',  project: 'Mobile App',   done: 7,  total: 15, daysLeft: 2,  color: '#8b5cf6', href: '/sprints' },
]

export function SprintProgress() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <CardTitle>Active Sprints</CardTitle>
        </div>
        <Link
          href="/sprints"
          className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors duration-150"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pt-4 flex-1">
        {sprints.map((sprint) => {
          const pct     = Math.round((sprint.done / sprint.total) * 100)
          const urgency = sprint.daysLeft <= 3

          return (
            <div key={sprint.name} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={sprint.href}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors duration-150"
                  >
                    <span className="group-hover:underline decoration-[0.5px] underline-offset-2"
                      style={{ textDecorationColor: sprint.color }}>
                      {sprint.name}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs"
                      style={{ color: sprint.color }}>↗</span>
                  </Link>
                  <p className="text-xs text-white/40">{sprint.project}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${urgency ? 'text-red-400' : 'text-white/50'}`}>
                  <Clock className="w-3 h-3" />
                  {sprint.daysLeft}d left
                </div>
              </div>

              <Progress value={sprint.done} max={sprint.total} size="md" showLabel />

              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{sprint.done} / {sprint.total} tasks done</span>
                <span className="text-white/60 font-medium">{pct}%</span>
              </div>
            </div>
          )
        })}

        {/* Velocity summary */}
        <div className="mt-auto pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-white/40 mb-3">Sprint Velocity (avg)</p>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">42</p>
              <p className="text-xs text-white/40">points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text">87%</p>
              <p className="text-xs text-white/40">efficiency</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">3.2d</p>
              <p className="text-xs text-white/40">avg resolution</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
