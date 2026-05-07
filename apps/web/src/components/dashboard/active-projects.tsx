'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowUpRight, Bug, CheckSquare } from 'lucide-react'

const projects = [
  {
    id: '1', name: 'Sentinel Project Manager',
    description: 'Core SaaS platform development',
    progress: 68, status: 'ACTIVE', priority: 'HIGH',
    color: '#6366f1',
    bugs: 12, tasks: 48,
    members: [
      { name: 'Raphael Castilho' }, { name: 'Antonio Silva' }, { name: 'Maria Santos' }, { name: 'João Lima' }
    ],
    dueDate: '30 Jun 2026',
  },
  {
    id: '2', name: 'API Gateway v2',
    description: 'Refactor and scale backend infrastructure',
    progress: 42, status: 'ACTIVE', priority: 'CRITICAL',
    color: '#06b6d4',
    bugs: 8, tasks: 31,
    members: [
      { name: 'Carlos Mendes' }, { name: 'Fernanda Costa' }, { name: 'Roberto Alves' }
    ],
    dueDate: '15 Jun 2026',
  },
  {
    id: '3', name: 'Mobile App QA',
    description: 'End-to-end testing for iOS and Android',
    progress: 85, status: 'ACTIVE', priority: 'MEDIUM',
    color: '#8b5cf6',
    bugs: 4, tasks: 22,
    members: [
      { name: 'Lucas Ferreira' }, { name: 'Juliana Ribeiro' }
    ],
    dueDate: '10 Jun 2026',
  },
]

const priorityColor: Record<string, string> = {
  LOW: 'text-emerald-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-orange-400',
  CRITICAL: 'text-red-400',
}

export function ActiveProjects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
        <Link href="/projects" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              {/* Color dot */}
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}66` }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white">
                    {p.name}
                  </p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-primary shrink-0 transition-colors" />
                </div>
                <p className="text-xs text-white/40 mb-3">{p.description}</p>

                <Progress value={p.progress} size="sm" />

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Bug className="w-3 h-3" /> {p.bugs}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" /> {p.tasks}
                    </span>
                    <span className={cn('font-medium', priorityColor[p.priority])}>
                      {p.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AvatarGroup users={p.members} max={3} size="xs" />
                    <span className="text-xs text-white/30">{p.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
