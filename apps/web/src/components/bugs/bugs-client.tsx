'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Bug, X, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BugTable } from './bug-table'
import { BugStats } from './bug-stats'
import { cn } from '@/lib/utils'
import type { Bug as BugType, BugSeverity, BugStatus, Priority } from '@/types'

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
  const [bugs, setBugs] = useState<BugType[]>(mockBugs)
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedBug, setSelectedBug] = useState<BugType | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [quickFilter, setQuickFilter] = useState<'total' | 'open' | 'critical' | 'resolved'>('total')

  const filtered = bugs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.bugId.toLowerCase().includes(search.toLowerCase())
    const matchSev = severity === 'ALL' || b.severity === severity
    const matchStatus = status === 'ALL' || b.status === status
    return matchSearch && matchSev && matchStatus
  })

  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'OPEN').length,
    critical: bugs.filter(b => b.severity === 'CRITICAL').length,
    resolved: bugs.filter(b => b.status === 'RESOLVED' || b.status === 'CLOSED').length,
  }

  const applyQuickFilter = (filter: 'total' | 'open' | 'critical' | 'resolved') => {
    setQuickFilter(filter)
    if (filter === 'total') {
      setSeverity('ALL')
      setStatus('ALL')
    } else if (filter === 'open') {
      setSeverity('ALL')
      setStatus('OPEN')
    } else if (filter === 'critical') {
      setSeverity('CRITICAL')
      setStatus('ALL')
    } else {
      setSeverity('ALL')
      setStatus('RESOLVED')
    }
  }

  const addBug = (bug: BugType) => {
    setBugs(current => [bug, ...current])
    setReportOpen(false)
    applyQuickFilter('total')
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
        <Button onClick={() => setReportOpen(true)} variant="glow" leftIcon={<Plus className="w-4 h-4" />}>
          Report Bug
        </Button>
      </div>

      {/* Stats */}
      <BugStats stats={stats} active={quickFilter} onFilter={applyQuickFilter} />

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
              onClick={() => { setSeverity(s); setQuickFilter('total') }}
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
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'IN_REVIEW', 'RESOLVED', 'CLOSED'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setQuickFilter('total') }}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                status === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              {s === 'ALL' ? 'All' : s === 'IN_PROGRESS' ? 'In Progress' : s === 'IN_REVIEW' ? 'In Review' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <BugTable bugs={filtered} onOpenBug={bug => { setSelectedBug(bug); setFullscreen(false) }} />

      {reportOpen && <ReportBugModal onClose={() => setReportOpen(false)} onCreate={addBug} nextNumber={bugs.length + 43} />}
      {selectedBug && (
        <BugDetailModal
          bug={selectedBug}
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen(v => !v)}
          onClose={() => setSelectedBug(null)}
        />
      )}
    </div>
  )
}

function ReportBugModal({ onClose, onCreate, nextNumber }: { onClose: () => void; onCreate: (bug: BugType) => void; nextNumber: number }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<BugSeverity>('MEDIUM')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [environment, setEnvironment] = useState('Production')

  const inputCls = 'w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 outline-none focus:border-primary/50'

  const create = () => {
    if (!title.trim() || !description.trim()) return
    const now = new Date().toISOString()
    const base = mockBugs[0]
    onCreate({
      ...base,
      id: String(Date.now()),
      bugId: `BUG-${String(nextNumber).padStart(3, '0')}`,
      title: title.trim(),
      description: description.trim(),
      severity,
      priority,
      status: 'OPEN',
      environment,
      tags: ['manual'],
      createdAt: now,
      updatedAt: now,
      resolvedAt: undefined,
      assignee: undefined,
      assigneeId: undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl dropdown-panel overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <span className="text-sm font-semibold text-white/90">Reportar bug</span>
          <button onClick={onClose} className="p-1 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="Titulo do bug" autoFocus />
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={cn(inputCls, 'resize-none')} rows={4} placeholder="Descricao e impacto" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={severity} onChange={e => setSeverity(e.target.value as BugSeverity)} className={inputCls}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as BugSeverity[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className={inputCls}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={environment} onChange={e => setEnvironment(e.target.value)} className={inputCls} placeholder="Ambiente" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button variant="glow" onClick={create} disabled={!title.trim() || !description.trim()} leftIcon={<Plus className="w-4 h-4" />}>Criar bug</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BugDetailModal({ bug, fullscreen, onToggleFullscreen, onClose }: { bug: BugType; fullscreen: boolean; onToggleFullscreen: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative dropdown-panel overflow-hidden', fullscreen ? 'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]' : 'w-full max-w-3xl max-h-[calc(100vh-2rem)]')}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div>
            <p className="text-xs font-mono text-primary">{bug.bugId}</p>
            <h2 className="text-base font-semibold text-white">{bug.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleFullscreen} className="p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-8rem)] space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Info label="Severity" value={bug.severity} />
            <Info label="Priority" value={bug.priority} />
            <Info label="Status" value={bug.status.replace('_', ' ')} />
            <Info label="Project" value={bug.project.name} />
          </div>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-2">Descricao</h3>
            <p className="text-sm text-white/70 leading-relaxed">{bug.description}</p>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Ambiente" value={bug.environment || 'Nao informado'} multiline />
            <Info label="Build" value={bug.buildVersion || 'Nao informado'} multiline />
            <Info label="Reporter" value={bug.reporter.name} multiline />
            <Info label="Assignee" value={bug.assignee?.name || 'Sem responsavel'} multiline />
          </div>
          {(bug.stepsToReproduce || bug.expectedBehavior || bug.actualBehavior) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info label="Reproducao" value={bug.stepsToReproduce || '-'} multiline />
              <Info label="Esperado" value={bug.expectedBehavior || '-'} multiline />
              <Info label="Atual" value={bug.actualBehavior || '-'} multiline />
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {bug.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded-md text-xs bg-white/[0.05] text-white/45 border border-white/[0.06]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">{label}</p>
      <p className={cn('text-sm text-white/75', multiline && 'whitespace-pre-wrap leading-relaxed')}>{value}</p>
    </div>
  )
}
