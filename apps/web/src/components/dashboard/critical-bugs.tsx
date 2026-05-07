'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SeverityBadge, BugStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'
import { ArrowUpRight, AlertTriangle } from 'lucide-react'
import type { BugSeverity, BugStatus } from '@/types'

const bugs = [
  {
    id: '1', bugId: 'BUG-042', title: 'Auth token not refreshing on mobile',
    severity: 'CRITICAL' as BugSeverity, status: 'OPEN' as BugStatus,
    project: 'Mobile App', reporter: { name: 'Maria Santos' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2', bugId: 'BUG-039', title: 'Kanban drag-drop breaks on Safari',
    severity: 'HIGH' as BugSeverity, status: 'IN_PROGRESS' as BugStatus,
    project: 'SPM Frontend', reporter: { name: 'João Lima' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3', bugId: 'BUG-037', title: 'Memory leak in Socket.IO connection',
    severity: 'HIGH' as BugSeverity, status: 'IN_REVIEW' as BugStatus,
    project: 'API Gateway', reporter: { name: 'Carlos Mendes' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4', bugId: 'BUG-035', title: 'Sprint burndown calc wrong with subtasks',
    severity: 'MEDIUM' as BugSeverity, status: 'OPEN' as BugStatus,
    project: 'SPM Frontend', reporter: { name: 'Raphael Castilho' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
]

export function CriticalBugs() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <CardTitle>Critical & High Bugs</CardTitle>
        </div>
        <Link href="/bugs?severity=CRITICAL,HIGH" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {bugs.map((bug) => (
          <Link
            key={bug.id}
            href={`/bugs/${bug.id}`}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-white/40 font-mono">{bug.bugId}</span>
                <SeverityBadge severity={bug.severity} />
                <BugStatusBadge status={bug.status} />
              </div>
              <p className="text-sm text-white/80 group-hover:text-white truncate">{bug.title}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-white/30">{bug.project}</span>
                <div className="flex items-center gap-1.5">
                  <Avatar user={bug.reporter} size="xs" />
                  <span className="text-xs text-white/30">{timeAgo(bug.createdAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
