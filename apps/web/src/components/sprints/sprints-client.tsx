'use client'

import { useMemo, useState } from 'react'
import type React from 'react'
import Link from 'next/link'
import { Plus, Zap, Play, Clock, ArrowUpRight, Users, Bug, CheckCircle2, AlertTriangle, KanbanSquare, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TaskStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BurndownChart } from './burndown-chart'
import { cn, formatDate } from '@/lib/utils'
import { TEAM } from '@/lib/team-data'
import type { SprintStatus, TaskStatus } from '@/types'

const sprints = [
  {
    id: '1',
    name: 'Sprint 14',
    status: 'ACTIVE' as SprintStatus,
    health: 'Risco moderado',
    goal: 'Fechar Dashboard, Calendar, Projects e ajustes finais de Board.',
    project: 'Sentinel Project Manager',
    startDate: '2026-04-28',
    endDate: '2026-05-11',
    planned: 42,
    completed: 28,
    bugs: 4,
    blockers: 1,
    tasks: [
      { id: 't1', title: 'Dashboard operational insights', status: 'DONE' as TaskStatus, points: 8, assignee: TEAM[0].user },
      { id: 't2', title: 'Kanban drag and drop precision', status: 'QA_TESTING' as TaskStatus, points: 5, assignee: TEAM[0].user },
      { id: 't3', title: 'Calendar event history', status: 'IN_PROGRESS' as TaskStatus, points: 5, assignee: TEAM[1].user },
      { id: 't4', title: 'Projects filters and deletion flow', status: 'IN_PROGRESS' as TaskStatus, points: 8, assignee: TEAM[1].user },
      { id: 't5', title: 'Bugs detail preview', status: 'TODO' as TaskStatus, points: 8, assignee: TEAM[0].user },
    ],
  },
  {
    id: '2',
    name: 'Sprint 9',
    status: 'ACTIVE' as SprintStatus,
    health: 'Em dia',
    goal: 'Refatorar API Gateway com rate limiting e observabilidade.',
    project: 'API Gateway v2',
    startDate: '2026-04-21',
    endDate: '2026-05-04',
    planned: 35,
    completed: 24,
    bugs: 2,
    blockers: 0,
    tasks: [
      { id: 't6', title: 'Rate limit policy matrix', status: 'DONE' as TaskStatus, points: 5, assignee: TEAM[1].user },
      { id: 't7', title: 'API monitoring dashboard', status: 'REVIEW' as TaskStatus, points: 8, assignee: TEAM[1].user },
      { id: 't8', title: 'Regression suite', status: 'QA_TESTING' as TaskStatus, points: 8, assignee: TEAM[0].user },
    ],
  },
]

export function SprintsClient() {
  const [activeSprint, setActiveSprint] = useState(sprints[0])

  const metrics = useMemo(() => {
    const totalTasks = activeSprint.tasks.length
    const doneTasks = activeSprint.tasks.filter(t => t.status === 'DONE').length
    const qaTasks = activeSprint.tasks.filter(t => t.status === 'QA_TESTING' || t.status === 'REVIEW').length
    const progress = Math.round((activeSprint.completed / activeSprint.planned) * 100)
    return { totalTasks, doneTasks, qaTasks, progress }
  }, [activeSprint])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-400" /> Sprints
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{sprints.filter(s => s.status === 'ACTIVE').length} active sprints with actionable status</p>
        </div>
        <Button variant="glow" leftIcon={<Plus className="w-4 h-4" />}>New Sprint</Button>
      </div>

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
            <span className="text-xs opacity-60">- {s.project}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Progress', value: `${metrics.progress}%`, icon: <CheckCircle2 className="w-4 h-4" />, href: '/kanban' },
          { label: 'Tasks', value: `${metrics.doneTasks}/${metrics.totalTasks}`, icon: <KanbanSquare className="w-4 h-4" />, href: '/kanban' },
          { label: 'Bugs', value: activeSprint.bugs, icon: <Bug className="w-4 h-4" />, href: '/bugs' },
          { label: 'Blockers', value: activeSprint.blockers, icon: <AlertTriangle className="w-4 h-4" />, href: '/bugs' },
        ].map(item => (
          <Link key={item.label} href={item.href} className="glass-card-hover p-4 border border-white/[0.07] flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-primary flex items-center justify-center">{item.icon}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <Card>
            <CardContent>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeSprint.name}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{activeSprint.goal}</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/25">
                  <Play className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                <SprintBox label="Planned pts" value={activeSprint.planned} />
                <SprintBox label="Completed" value={activeSprint.completed} color="text-emerald-400" />
                <SprintBox label="QA/Review" value={metrics.qaTasks} color="text-cyan-400" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Sprint progress</span>
                  <span>{metrics.progress}%</span>
                </div>
                <Progress value={activeSprint.completed} max={activeSprint.planned} size="lg" color="primary" />
              </div>

              <div className="flex items-center justify-between mt-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(activeSprint.startDate)}</span>
                <span>{activeSprint.health}</span>
                <span>{formatDate(activeSprint.endDate)}</span>
              </div>
            </CardContent>
          </Card>

          <BurndownChart sprintName={activeSprint.name} planned={activeSprint.planned} />

          <Card>
            <CardHeader>
              <CardTitle>Sprint Tasks</CardTitle>
              <Link href="/kanban" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                Abrir board <ArrowUpRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {activeSprint.tasks.map(task => (
                <Link key={task.id} href="/kanban" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{task.title}</p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                  <div className="flex items-center gap-1.5">
                    <Avatar user={task.assignee} size="xs" />
                    <span className="text-xs font-bold text-white/40 w-6 text-right">{task.points}p</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Link href="/team" className="block glass-card-hover border border-white/[0.07]">
            <div className="flex items-center justify-between p-5 pb-0">
              <CardTitle>Team real ({TEAM.length})</CardTitle>
              <ArrowUpRight className="w-4 h-4 text-white/35" />
            </div>
            <CardContent className="pt-3 space-y-3">
              {TEAM.map(member => (
                <div key={member.user.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.025]">
                  <Avatar user={member.user} size="sm" showStatus isOnline />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">{member.user.name}</p>
                    <p className="text-xs text-white/35 truncate">{member.title}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: member.color }}>{member.sprintsCompleted}</span>
                </div>
              ))}
            </CardContent>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Atalhos</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 grid grid-cols-2 gap-2">
              <QuickLink href="/projects" icon={<FolderKanban className="w-4 h-4" />} label="Projects" />
              <QuickLink href="/bugs" icon={<Bug className="w-4 h-4" />} label="Bugs" />
              <QuickLink href="/kanban" icon={<KanbanSquare className="w-4 h-4" />} label="Board" />
              <QuickLink href="/team" icon={<Users className="w-4 h-4" />} label="Team" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SprintBox({ label, value, color = 'text-white' }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  )
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
