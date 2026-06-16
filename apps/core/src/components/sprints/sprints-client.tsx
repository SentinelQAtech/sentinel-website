'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Zap, ArrowUpRight, Users, Bug, KanbanSquare,
  FolderKanban, X, Calendar, Trash2, CheckCircle2,
  Clock, Ban, Loader2, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSprints, useCreateSprint, useUpdateSprint, useDeleteSprint } from '@/hooks/useSprints'
import { useProjects } from '@/hooks/useProjects'
import { useTeamStore } from '@/store/team'
import { useI18nStore } from '@/store/i18n'
import { getTodayISO } from '@/store/daily'
import type { Sprint, SprintStatus } from '@/types'

// ─── Status config ────────────────────────────────────────────

const STATUS_CONFIG: Record<SprintStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  PLANNING:  { label: 'Planejamento', color: '#6366f1', bg: 'bg-indigo-500/10',  border: 'border-indigo-500/25',  icon: Clock },
  ACTIVE:    { label: 'Ativa',        color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', icon: Zap },
  COMPLETED: { label: 'Concluída',    color: '#06b6d4', bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelada',    color: '#ef4444', bg: 'bg-red-500/10',     border: 'border-red-500/25',     icon: Ban },
}

// ─── Helpers ──────────────────────────────────────────────────

function daysLeft(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
}

function formatRange(start: string, end: string): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${fmt(start)} → ${fmt(end)}`
}

function twoWeeksISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

// ─── Sprint Card ──────────────────────────────────────────────

function SprintCard({ sprint, onDelete, onStatusChange }: {
  sprint: Sprint
  onDelete: () => void
  onStatusChange: (status: SprintStatus) => void
}) {
  const cfg  = STATUS_CONFIG[sprint.status]
  const Icon = cfg.icon
  const days = daysLeft(sprint.endDate)
  const isActive = sprint.status === 'ACTIVE'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group glass-card border p-4 space-y-3 transition-all duration-200',
        isActive ? 'border-emerald-500/30' : 'border-white/[0.07]',
        isActive && 'shadow-[0_0_24px_rgba(16,185,129,0.06)]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border', cfg.bg, cfg.border)} style={{ color: cfg.color }}>
              <Icon className="w-3 h-3" />
              {cfg.label}
            </span>
            {isActive && days > 0 && (
              <span className="text-[10px] text-white/35">{days}d restantes</span>
            )}
            {isActive && days <= 0 && (
              <span className="text-[10px] text-red-400">Vencida</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-white/90 truncate">{sprint.name}</h3>
          {sprint.goal && (
            <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{sprint.goal}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            title="Excluir sprint"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-1.5 text-[11px] text-white/35">
        <Calendar className="w-3 h-3" />
        {formatRange(sprint.startDate, sprint.endDate)}
        {sprint.capacity && (
          <span className="ml-auto text-white/25">Cap: {sprint.capacity}pts</span>
        )}
      </div>

      {/* Status change */}
      {sprint.status !== 'COMPLETED' && sprint.status !== 'CANCELLED' && (
        <div className="flex gap-1.5 pt-1 border-t border-white/[0.05]">
          {sprint.status === 'PLANNING' && (
            <button
              type="button"
              onClick={() => onStatusChange('ACTIVE')}
              className="flex-1 py-1 rounded-lg text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              Iniciar Sprint
            </button>
          )}
          {sprint.status === 'ACTIVE' && (
            <button
              type="button"
              onClick={() => onStatusChange('COMPLETED')}
              className="flex-1 py-1 rounded-lg text-[11px] font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
            >
              Concluir Sprint
            </button>
          )}
          <button
            type="button"
            onClick={() => onStatusChange('CANCELLED')}
            className="px-2 py-1 rounded-lg text-[11px] font-medium text-white/30 bg-white/[0.04] border border-white/[0.08] hover:text-white/60 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ─── Nova Sprint Modal ────────────────────────────────────────

function NewSprintModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const createSprint = useCreateSprint()
  const [name,      setName]      = useState('')
  const [goal,      setGoal]      = useState('')
  const [startDate, setStartDate] = useState(getTodayISO())
  const [endDate,   setEndDate]   = useState(twoWeeksISO())
  const [capacity,  setCapacity]  = useState('')
  const [status,    setStatus]    = useState<SprintStatus>('PLANNING')

  const inputCls = 'w-full px-3 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 outline-none focus:border-primary/50 transition-colors'
  const labelCls = 'block text-xs font-medium text-white/50 mb-1.5'

  const create = () => {
    if (!name.trim() || !startDate || !endDate) return
    createSprint.mutate({
      name: name.trim(),
      goal: goal.trim() || undefined,
      status,
      startDate,
      endDate,
      capacity: capacity ? Number(capacity) : undefined,
      projectId,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-md dropdown-panel overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-white/90">Nova Sprint</span>
          </div>
          <button type="button" title="Fechar" onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Nome *</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex: Sprint 01 — Junho 2026"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Objetivo</label>
            <textarea
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="Meta da sprint…"
              rows={2}
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Início *</label>
              <input type="date" title="Data de início" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Fim *</label>
              <input type="date" title="Data de fim" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Capacidade (pts)</label>
              <input
                type="number"
                min={0}
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                placeholder="ex: 40"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status inicial</label>
              <select title="Status inicial da sprint" value={status} onChange={e => setStatus(e.target.value as SprintStatus)} className={inputCls}>
                <option value="PLANNING">Planejamento</option>
                <option value="ACTIVE">Ativa</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              variant="glow"
              onClick={create}
              disabled={!name.trim() || !startDate || !endDate}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Criar Sprint
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <Card>
      <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-primary">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Nenhuma sprint criada</h2>
          <p className="mt-1 text-sm text-white/40 max-w-xs">
            Crie sua primeira sprint para organizar o ciclo de trabalho do time.
          </p>
        </div>
        <Button variant="glow" onClick={onNew} leftIcon={<Plus className="w-4 h-4" />}>
          Nova Sprint
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────

export function SprintsClient() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  // Project context
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const effectiveProjectId = selectedProjectId || projects?.[0]?.id || ''

  // Sprint data
  const { data: sprints = [], isLoading, isError } = useSprints(effectiveProjectId)
  const updateSprint  = useUpdateSprint()
  const deleteSprint  = useDeleteSprint()

  const members       = useTeamStore(s => s.members)
  const activeMembers = members.filter(m => m.user.isActive)

  const [createOpen, setCreateOpen] = useState(false)

  const active    = sprints.filter(s => s.status === 'ACTIVE')
  const planning  = sprints.filter(s => s.status === 'PLANNING')
  const completed = sprints.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED')

  const stats = [
    { label: 'Total', value: sprints.length,    color: '#6366f1' },
    { label: 'Ativas', value: active.length,    color: '#10b981' },
    { label: 'Planejamento', value: planning.length, color: '#f59e0b' },
    { label: 'Concluídas', value: completed.length,  color: '#06b6d4' },
  ]

  const noProject = !effectiveProjectId && !projectsLoading

  const hasProjects = projects && projects.length > 0

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-400" />
            {t('sprintsTitle')}
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {active.length} {t('activeSprintsWithStatus')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasProjects && (
            <select
              title="Selecionar projeto"
              value={selectedProjectId || projects[0].id}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/[0.1] text-white/70 hover:text-white outline-none transition-colors cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
          {effectiveProjectId && (
            <Button variant="glow" onClick={() => setCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              {t('newSprint')}
            </Button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && effectiveProjectId && (
        <Card>
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center text-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-white/60">Erro ao carregar sprints</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No project state */}
      {noProject && !isLoading && (
        <Card>
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center text-center gap-3">
            <FolderKanban className="w-8 h-8 text-white/30" />
            <p className="text-sm text-white/60">Selecione um projeto para ver as sprints</p>
          </CardContent>
        </Card>
      )}

      {/* Stats bar */}
      {sprints.length > 0 && !isLoading && !isError && (
        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="glass-card border border-white/[0.07] px-4 py-3 flex items-center gap-3">
              <span className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
              <span className="text-xs text-white/40">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* Sprint list */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {!isLoading && !isError && effectiveProjectId && sprints.length === 0 ? (
            <EmptyState onNew={() => setCreateOpen(true)} />
          ) : !isLoading && !isError ? (
            <>
              {active.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-2 px-1">Ativas</p>
                  <AnimatePresence>
                    {active.map(sp => (
                      <SprintCard key={sp.id} sprint={sp}
                        onDelete={() => deleteSprint.mutate(sp.id)}
                        onStatusChange={status => updateSprint.mutate({ id: sp.id, status })}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {planning.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-indigo-400/80 uppercase tracking-wider mb-2 px-1">Planejamento</p>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {planning.map(sp => (
                        <SprintCard key={sp.id} sprint={sp}
                          onDelete={() => deleteSprint.mutate(sp.id)}
                          onStatusChange={status => updateSprint.mutate({ id: sp.id, status })}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {completed.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/25 uppercase tracking-wider mb-2 px-1">Histórico</p>
                  <div className="space-y-3 opacity-60">
                    <AnimatePresence>
                      {completed.map(sp => (
                        <SprintCard key={sp.id} sprint={sp}
                          onDelete={() => deleteSprint.mutate(sp.id)}
                          onStatusChange={status => updateSprint.mutate({ id: sp.id, status })}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          {/* Real team */}
          <Link href="/team" className="block glass-card-hover border border-white/[0.07]">
            <div className="flex items-center justify-between p-5 pb-0">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/40" />
                {t('realTeam')} ({activeMembers.length})
              </CardTitle>
              <ArrowUpRight className="w-4 h-4 text-white/35" />
            </div>
            <CardContent className="pt-3 space-y-2">
              {activeMembers.length === 0 ? (
                <p className="text-xs text-white/30 italic px-1">Nenhum membro ativo</p>
              ) : (
                activeMembers.map(member => (
                  <div key={member.user.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.025]">
                    <Avatar user={member.user} size="sm" showStatus isOnline />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80 truncate">{member.user.name}</p>
                      <p className="text-xs text-white/35 truncate">{member.title}</p>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: member.color }}>
                      {member.sprintsCompleted}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Link>

          {/* Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle>{t('shortcuts')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 grid grid-cols-2 gap-2">
              <QuickLink href="/projects" icon={<FolderKanban className="w-4 h-4" />} label="Projetos" />
              <QuickLink href="/bugs"     icon={<Bug className="w-4 h-4" />}          label="Bugs" />
              <QuickLink href="/kanban"   icon={<KanbanSquare className="w-4 h-4" />} label="Board" />
              <QuickLink href="/team"     icon={<Users className="w-4 h-4" />}         label="Time" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {createOpen && effectiveProjectId && (
          <NewSprintModal projectId={effectiveProjectId} onClose={() => setCreateOpen(false)} />
        )}
      </AnimatePresence>
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
