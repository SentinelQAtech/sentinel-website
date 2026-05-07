'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Bug, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BugTable } from './bug-table'
import { BugStats } from './bug-stats'
import { cn } from '@/lib/utils'
import type { Bug as BugType, BugSeverity, BugStatus } from '@/types'

export const mockBugs: BugType[] = [
  {
    id: '1', bugId: 'BUG-042',
    title: 'Auth token not refreshing on mobile Safari',
    description: 'When the access token expires on iOS Safari, the refresh token mechanism silently fails.',
    severity: 'CRITICAL', priority: 'HIGH', status: 'OPEN',
    environment: 'Production / iOS 17 / Safari',
    stepsToReproduce: '1. Login on iOS Safari\n2. Wait 15 min\n3. Perform any API call',
    expectedBehavior: 'Token should refresh automatically',
    actualBehavior: 'User gets 401 and needs to re-login',
    browserInfo: 'Safari 17.2', osInfo: 'iOS 17.3', buildVersion: '1.4.2',
    tags: ['auth', 'mobile', 'token'],
    projectId: '1', reporterId: '3',
    reporter: { id: '3', email: '', username: 'maria', name: 'Maria Santos', role: 'QA_ANALYST', isActive: true, createdAt: '' },
    project: { id: '1', name: 'SPM', description: '', status: 'ACTIVE', priority: 'HIGH', progress: 68, tags: [], coverColor: '#6366f1', ownerId: '1', owner: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, members: [], createdAt: '', updatedAt: '' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2', bugId: 'BUG-041',
    title: 'Kanban drag & drop breaks on Safari desktop',
    description: 'DnD kit pointer events not working on Safari 17 due to missing pointer capture polyfill.',
    severity: 'HIGH', priority: 'HIGH', status: 'IN_PROGRESS',
    environment: 'Production / macOS / Safari 17',
    tags: ['kanban', 'dnd', 'safari'],
    projectId: '1', reporterId: '1',
    reporter: { id: '1', email: '', username: 'rapha', name: 'Raphael Castilho', role: 'ADMIN', isActive: true, createdAt: '' },
    project: { id: '1', name: 'SPM', description: '', status: 'ACTIVE', priority: 'HIGH', progress: 68, tags: [], coverColor: '#6366f1', ownerId: '1', owner: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, members: [], createdAt: '', updatedAt: '' },
    assigneeId: '2',
    assignee: { id: '2', email: '', username: 'antonio', name: 'Antonio Silva', role: 'DEVELOPER', isActive: true, createdAt: '' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3', bugId: 'BUG-039',
    title: 'Memory leak in Socket.IO disconnect handler',
    description: 'Event listeners are not removed on component unmount, causing memory leaks after navigation.',
    severity: 'HIGH', priority: 'CRITICAL', status: 'IN_REVIEW',
    environment: 'Staging / Node 20 / Chrome 120',
    tags: ['socket.io', 'memory', 'leak'],
    projectId: '2', reporterId: '4',
    reporter: { id: '4', email: '', username: 'carlos', name: 'Carlos Mendes', role: 'DEVELOPER', isActive: true, createdAt: '' },
    project: { id: '2', name: 'API Gateway', description: '', status: 'ACTIVE', priority: 'CRITICAL', progress: 42, tags: [], coverColor: '#06b6d4', ownerId: '2', owner: { id: '2', email: '', username: '', name: 'Antonio', role: 'DEVELOPER', isActive: true, createdAt: '' }, members: [], createdAt: '', updatedAt: '' },
    assigneeId: '4',
    assignee: { id: '4', email: '', username: 'carlos', name: 'Carlos Mendes', role: 'DEVELOPER', isActive: true, createdAt: '' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '4', bugId: 'BUG-038',
    title: 'Sprint burndown chart shows incorrect velocity',
    description: 'Story points from subtasks are being double-counted in velocity calculation.',
    severity: 'MEDIUM', priority: 'MEDIUM', status: 'OPEN',
    environment: 'Production',
    tags: ['sprints', 'chart', 'velocity'],
    projectId: '1', reporterId: '1',
    reporter: { id: '1', email: '', username: 'rapha', name: 'Raphael Castilho', role: 'ADMIN', isActive: true, createdAt: '' },
    project: { id: '1', name: 'SPM', description: '', status: 'ACTIVE', priority: 'HIGH', progress: 68, tags: [], coverColor: '#6366f1', ownerId: '1', owner: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, members: [], createdAt: '', updatedAt: '' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '5', bugId: 'BUG-036',
    title: 'File upload silently fails for files > 5MB',
    description: 'The API returns 413 but the frontend shows a success toast, misleading users.',
    severity: 'MEDIUM', priority: 'HIGH', status: 'RESOLVED',
    environment: 'Production / Chrome',
    tags: ['upload', 'ux', 'api'],
    projectId: '1', reporterId: '3',
    reporter: { id: '3', email: '', username: 'maria', name: 'Maria Santos', role: 'QA_ANALYST', isActive: true, createdAt: '' },
    project: { id: '1', name: 'SPM', description: '', status: 'ACTIVE', priority: 'HIGH', progress: 68, tags: [], coverColor: '#6366f1', ownerId: '1', owner: { id: '1', email: '', username: '', name: 'Raphael', role: 'ADMIN', isActive: true, createdAt: '' }, members: [], createdAt: '', updatedAt: '' },
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

type SeverityFilter = 'ALL' | BugSeverity
type StatusFilter = 'ALL' | BugStatus

export function BugsClient() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<SeverityFilter>('ALL')
  const [status, setStatus] = useState<StatusFilter>('ALL')

  const filtered = mockBugs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.bugId.toLowerCase().includes(search.toLowerCase())
    const matchSev = severity === 'ALL' || b.severity === severity
    const matchStatus = status === 'ALL' || b.status === status
    return matchSearch && matchSev && matchStatus
  })

  const stats = {
    total: mockBugs.length,
    open: mockBugs.filter(b => b.status === 'OPEN').length,
    critical: mockBugs.filter(b => b.severity === 'CRITICAL').length,
    resolved: mockBugs.filter(b => b.status === 'RESOLVED' || b.status === 'CLOSED').length,
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bug className="w-6 h-6 text-red-400" />
            Bug Tracker
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Track and manage issues across all projects</p>
        </div>
        <Button variant="glow" leftIcon={<Plus className="w-4 h-4" />}>
          Report Bug
        </Button>
      </div>

      {/* Stats */}
      <BugStats stats={stats} />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Search bugs..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as SeverityFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                severity === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                status === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              {s === 'ALL' ? 'All' : s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <BugTable bugs={filtered} />
    </div>
  )
}
