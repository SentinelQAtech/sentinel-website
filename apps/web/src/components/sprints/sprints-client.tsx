'use client'

import { useState } from 'react'
import { Plus, Zap, Play, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TaskStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BurndownChart } from './burndown-chart'
import { cn, formatDate } from '@/lib/utils'
import type { SprintStatus } from '@/types'

const sprints = [
  {
    id: '1', name: 'Sprint 14', status: 'ACTIVE' as SprintStatus,
    goal: 'Complete Dashboard and Kanban modules',
    project: 'Sentinel Project Manager',
    startDate: '2026-04-28', endDate: '2026-05-11',
    planned: 42, completed: 28, inProgress: 8,
    members: [
      { name: 'Raphael Castilho' }, { name: 'Antonio Silva' },
      { name: 'Maria Santos' }, { name: 'João Lima' },
    ],
    tasks: [
      { id: 't1', title: 'Build Dashboard page',      status: 'IN_PROGRESS' as const, points: 8, assignee: { name: 'Raphael Castilho' } },
      { id: 't2', title: 'Kanban drag & drop',        status: 'QA_TESTING' as const,  points: 5, assignee: { name: 'Maria Santos'    } },
      { id: 't3', title: 'Bug tracker module',        status: 'TODO' as const,         points: 13, assignee: { name: 'Antonio Silva'   } },
      { id: 't4', title: 'Design system tokens',      status: 'DONE' as const,         points: 3, assignee: { name: 'Raphael Castilho' } },
      { id: 't5', title: 'Auth module',               status: 'DONE' as const,         points: 5, assignee: { name: 'Antonio Silva'   } },
      { id: 't6', title: 'Sprint velocity chart',     status: 'IN_PROGRESS' as const, points: 5, assignee: { name: 'João Lima'        } },
    ],
  },
  {
    id: '2', name: 'Sprint 9', status: 'ACTIVE' as SprintStatus,
    goal: 'Refactor API Gateway with improved rate limiting',
    project: 'API Gateway v2',
    startDate: '2026-04-21', endDate: '2026-05-04',
    planned: 35, completed: 22, inProgress: 6,
    members: [
      { name: 'Carlos Mendes' }, { name: 'Fernanda Costa' },
    ],
    tasks: [],
  },
]

export function SprintsClient() {
  const [activeSprint, setActiveSprint] = useState(sprints[0])

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-400" /> Sprints
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{sprints.filter(s => s.status === 'ACTIVE').length} active sprints</p>
        </div>
        <Button variant="glow" leftIcon={<Plus className="w-4 h-4" />}>New Sprint</Button>
      </div>

      {/* Sprint selector tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {sprints.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSprint(s)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0',
              activeSprint.id === s.id
                ? 'bg-primary/20 border border-primary/30 text-primary'
                : 'bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.06]'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {s.name}
            <span className="text-xs opacity-60">· {s.project}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Sprint detail — left */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {/* Sprint info card */}
          <Card>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeSprint.name}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{activeSprint.goal}</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/25">
                  <Play className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-white">{activeSprint.planned}</p>
                  <p className="text-xs text-white/40 mt-0.5">Planned pts</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-emerald-400">{activeSprint.completed}</p>
                  <p className="text-xs text-white/40 mt-0.5">Completed</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-violet-400">{activeSprint.inProgress}</p>
                  <p className="text-xs text-white/40 mt-0.5">In Progress</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Sprint progress</span>
                  <span>{Math.round((activeSprint.completed / activeSprint.planned) * 100)}%</span>
                </div>
                <Progress value={activeSprint.completed} max={activeSprint.planned} size="lg" color="primary" />
              </div>

              <div className="flex items-center justify-between mt-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(activeSprint.startDate)}</span>
                <span>→</span>
                <span>{formatDate(activeSprint.endDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Burndown */}
          <BurndownChart sprintName={activeSprint.name} planned={activeSprint.planned} />

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Tasks</CardTitle>
              <span className="text-xs text-white/40">{activeSprint.tasks.length} tasks</span>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {activeSprint.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{task.title}</p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                  <div className="flex items-center gap-1.5">
                    <Avatar user={task.assignee} size="xs" />
                    <span className="text-xs font-bold text-white/40 w-6 text-right">{task.points}p</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Team — right */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Team ({activeSprint.members.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {activeSprint.members.map(m => (
                <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                  <Avatar user={m} size="sm" showStatus isOnline />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/80">{m.name}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
