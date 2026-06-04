'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Bug, X, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BugTable } from './bug-table'
import { BugStats } from './bug-stats'
import { cn } from '@/lib/utils'
import { useI18nStore } from '@/store/i18n'
import { useBugsStore, defaultReporter, defaultProject } from '@/store/bugs'
import { useQAImporterStore } from '@/store/qa-importer'
import type { Bug as BugType, BugSeverity, BugStatus, Priority } from '@/types'

type SeverityFilter = 'ALL' | BugSeverity
type StatusFilter = 'ALL' | BugStatus

export function BugsClient() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<SeverityFilter>('ALL')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const bugs = useBugsStore(s => s.bugs)
  const addBugToStore = useBugsStore(s => s.addBug)
  const syncFromQA = useBugsStore(s => s.syncFromQAImporter)
  const qaItems = useQAImporterStore(s => s.items)
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedBug, setSelectedBug] = useState<BugType | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [quickFilter, setQuickFilter] = useState<'total' | 'open' | 'critical' | 'resolved'>('total')

  // Fingerprint only the fields syncFromQAImporter actually reads so that
  // unrelated QA edits (notes, comments, etc.) do not trigger a full rebuild
  // and localStorage write.
  const qaFingerprint = useMemo(
    () => qaItems.map(i => `${i.id}|${i.title}|${i.priority}|${i.qaCategory}|${i.status}|${i.source}`).join('\n'),
    [qaItems]
  )

  useEffect(() => {
    syncFromQA(qaItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qaFingerprint, syncFromQA])

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
    addBugToStore(bug)
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
            {t('bugsTitle')}
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{t('bugsSubtitle')}</p>
        </div>
        <Button onClick={() => setReportOpen(true)} variant="glow" leftIcon={<Plus className="w-4 h-4" />}>
          {t('reportBug')}
        </Button>
      </div>

      {/* Stats */}
      <BugStats stats={stats} active={quickFilter} onFilter={applyQuickFilter} />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder={t('searchBugs')}
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
              {s === 'ALL' ? t('all') : s.charAt(0) + s.slice(1).toLowerCase()}
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
              {s === 'ALL' ? t('all') : s === 'IN_PROGRESS' ? 'In Progress' : s === 'IN_REVIEW' ? 'In Review' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <BugTable bugs={filtered} onOpenBug={bug => { setSelectedBug(bug); setFullscreen(false) }} />

      {reportOpen && <ReportBugModal onClose={() => setReportOpen(false)} onCreate={addBug} nextNumber={bugs.length + 1} />}
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
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<BugSeverity>('MEDIUM')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [environment, setEnvironment] = useState('')

  const inputCls = 'w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 outline-none focus:border-primary/50'

  const create = () => {
    if (!title.trim() || !description.trim()) return
    const now = new Date().toISOString()
    onCreate({
      id: String(Date.now()),
      bugId: `BUG-${String(nextNumber).padStart(3, '0')}`,
      title: title.trim(),
      description: description.trim(),
      severity,
      priority,
      status: 'OPEN',
      environment,
      tags: ['manual'],
      projectId: defaultProject.id,
      reporterId: defaultReporter.id,
      reporter: defaultReporter,
      project: defaultProject,
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
          <span className="text-sm font-semibold text-white/90">{t('reportBug')}</span>
          <button onClick={onClose} className="p-1 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder={t('bugTitle')} autoFocus />
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={cn(inputCls, 'resize-none')} rows={4} placeholder={t('impactDescription')} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={severity} onChange={e => setSeverity(e.target.value as BugSeverity)} className={inputCls}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as BugSeverity[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className={inputCls}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={environment} onChange={e => setEnvironment(e.target.value)} className={inputCls} placeholder={t('environment')} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="glow" onClick={create} disabled={!title.trim() || !description.trim()} leftIcon={<Plus className="w-4 h-4" />}>{t('createBug')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BugDetailModal({ bug, fullscreen, onToggleFullscreen, onClose }: { bug: BugType; fullscreen: boolean; onToggleFullscreen: () => void; onClose: () => void }) {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative dropdown-panel flex flex-col', fullscreen ? 'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]' : 'w-full max-w-3xl max-h-[calc(100vh-2rem)]')}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
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
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Info label={t('severity')} value={bug.severity} />
            <Info label={t('priority')} value={bug.priority} />
            <Info label={t('status')} value={bug.status.replace('_', ' ')} />
            <Info label={t('project')} value={bug.project.name} />
          </div>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-2">{t('description')}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{bug.description}</p>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label={t('environment')} value={bug.environment || '-'} multiline />
            <Info label="Build" value={bug.buildVersion || 'Nao informado'} multiline />
            <Info label={t('reporter')} value={bug.reporter.name} multiline />
            <Info label={t('assignee')} value={bug.assignee?.name || '-'} multiline />
          </div>
          {(bug.stepsToReproduce || bug.expectedBehavior || bug.actualBehavior) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info label={t('reproduction')} value={bug.stepsToReproduce || '-'} multiline />
              <Info label={t('expected')} value={bug.expectedBehavior || '-'} multiline />
              <Info label={t('actual')} value={bug.actualBehavior || '-'} multiline />
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
