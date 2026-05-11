'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Grid2X2, List, SlidersHorizontal, X, AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectCard } from './project-card'
import { cn } from '@/lib/utils'
import { COMPANIES, type CompanyKey } from '@/lib/companies'
import { useI18nStore } from '@/store/i18n'
import { useProjectsStore } from '@/store/projects'
import type { Priority, Project } from '@/types'

const owner1 = { id: '1', email: 'rapha@sentinel.tech', username: 'raphacastilho', name: 'Raphael Castilho', role: 'ADMIN' as const, isActive: true, createdAt: '' }

type ViewMode = 'grid' | 'list'
type FilterStatus = 'ALL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
type FilterCompany = 'ALL' | CompanyKey
type FilterPriority = 'ALL' | Priority

export function ProjectsClient() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const [search, setSearch]       = useState('')
  const [view, setView]           = useState<ViewMode>('grid')
  const [status, setStatus]       = useState<FilterStatus>('ALL')
  const [company, setCompany]     = useState<FilterCompany>('ALL')
  const [priority, setPriority]   = useState<FilterPriority>('ALL')
  const projects = useProjectsStore(s => s.projects)
  const addProjectToStore = useProjectsStore(s => s.addProject)
  const deleteProjectFromStore = useProjectsStore(s => s.deleteProject)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [newOpen, setNewOpen]     = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const filtered = projects.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.description?.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = status === 'ALL' || p.status === status
    const matchCompany = company === 'ALL' || p.clientName === company
    const matchPriority = priority === 'ALL' || p.priority === priority
    return matchSearch && matchStatus && matchCompany && matchPriority
  })

  const addProject = (project: Project) => {
    addProjectToStore(project)
    setNewOpen(false)
  }

  const deleteProject = () => {
    if (!deleteTarget || confirmText !== deleteTarget.name) return
    deleteProjectFromStore(deleteTarget.id)
    setDeleteTarget(null)
    setConfirmText('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('projectsTitle')}</h1>
          <p className="text-sm text-white/40 mt-0.5">{filtered.length} / {projects.length}</p>
        </div>
        <Button onClick={() => setNewOpen(true)} variant="glow" leftIcon={<Plus className="w-4 h-4" />}>
          {t('newProject')}
        </Button>
      </div>

      {/* ── Company filter ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-white/30 font-medium uppercase tracking-wider">Client</span>

        {/* All */}
        <button
          onClick={() => setCompany('ALL')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
            company === 'ALL'
              ? 'bg-white/10 border-white/25 text-white'
              : 'bg-white/[0.03] border-white/[0.08] text-white/45 hover:text-white/70 hover:bg-white/[0.06]'
          )}
        >
          {t('allClients')}
        </button>

        {/* Per company */}
        {(Object.keys(COMPANIES) as CompanyKey[]).map(key => {
          const c = COMPANIES[key]
          const isActive = company === key
          const count = projects.filter(p => p.clientName === key).length
          return (
            <button
              key={key}
              onClick={() => setCompany(isActive ? 'ALL' : key)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                isActive
                  ? cn(c.bg, c.text, c.border, 'shadow-sm')
                  : 'bg-white/[0.03] border-white/[0.08] text-white/45 hover:text-white/70 hover:bg-white/[0.06]'
              )}
              style={isActive ? { boxShadow: `0 0 10px ${c.color}30` } : {}}
            >
              <span className="text-sm leading-none">{c.flag}</span>
              <span>{c.label}</span>
              <span className={cn(
                'ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                isActive ? 'bg-white/20' : 'bg-white/[0.07] text-white/35'
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder={t('searchProjects')}
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
          {(['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                status === s ? 'bg-primary/20 text-primary' : 'text-white/50 hover:text-white/70'
              )}
            >
              {s === 'ALL' ? t('all') : t(s.toLowerCase())}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFiltersOpen(v => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all duration-150',
            filtersOpen
              ? 'bg-primary/15 border-primary/30 text-primary'
              : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> {t('filters')}
        </button>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
          <button onClick={() => setView('grid')} className={cn('p-1.5 rounded', view === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60')}>
            <Grid2X2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setView('list')} className={cn('p-1.5 rounded', view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60')}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="glass-card p-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-white/35 font-medium uppercase tracking-wider">{t('priority')}</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as FilterPriority[]).map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                priority === p
                  ? 'bg-primary/20 border-primary/30 text-primary'
                  : 'bg-white/[0.03] border-white/[0.08] text-white/45 hover:text-white/70'
              )}
            >
              {p === 'ALL' ? t('allPriorities') : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
          <button
            onClick={() => { setSearch(''); setStatus('ALL'); setCompany('ALL'); setPriority('ALL') }}
            className="ml-auto text-xs text-white/35 hover:text-white/70 transition-colors"
          >
            {t('clearFilters')}
          </button>
        </div>
      )}

      {/* ── Project grid ── */}
      <motion.div
        layout
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'flex flex-col gap-3'
        )}
      >
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <ProjectCard project={project} view={view} onDeleteRequest={project => { setDeleteTarget(project); setConfirmText('') }} />
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4 text-3xl">
              {company !== 'ALL' ? COMPANIES[company as CompanyKey].flag : '🔍'}
            </div>
            <p className="text-white/50 font-medium">{t('noProjectsFound')}</p>
            <p className="text-white/30 text-sm mt-1">{t('adjustFilters')}</p>
          </div>
        )}
      </motion.div>

      {newOpen && <NewProjectModal onClose={() => setNewOpen(false)} onCreate={addProject} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-md dropdown-panel border border-red-500/20 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-300" />
                <span className="text-sm font-semibold text-white/90">{t('deleteProject')}</span>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="p-1 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-white/55">
                Esta acao remove o projeto <span className="font-semibold text-white">{deleteTarget.name}</span> desta tela. Para confirmar, digite exatamente o nome do projeto.
              </p>
              <input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-white outline-none focus:border-red-400/50"
                placeholder={deleteTarget.name}
              />
              <Button
                variant="destructive"
                className="w-full"
                disabled={confirmText !== deleteTarget.name}
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={deleteProject}
              >
                {t('confirmDeleteProject')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NewProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (project: Project) => void }) {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientName, setClientName] = useState<CompanyKey>('Concept-USA')
  const [projectPriority, setProjectPriority] = useState<Priority>('MEDIUM')
  const [endDate, setEndDate] = useState('')

  const create = () => {
    if (!name.trim()) return
    const company = COMPANIES[clientName]
    onCreate({
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim() || 'Novo projeto criado pela tela Projects.',
      status: 'ACTIVE',
      priority: projectPriority,
      progress: 0,
      tags: ['novo'],
      clientName,
      coverColor: company.color,
      ownerId: owner1.id,
      owner: owner1,
      members: [],
      startDate: new Date().toISOString().slice(0, 10),
      endDate: endDate || undefined,
      _count: { tasks: 0, bugs: 0, sprints: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 outline-none focus:border-primary/50'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg dropdown-panel overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <span className="text-sm font-semibold text-white/90">{t('newProject')}</span>
          <button onClick={onClose} className="p-1 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder={t('projectName')} autoFocus />
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={cn(inputCls, 'resize-none')} rows={3} placeholder={t('description')} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={clientName} onChange={e => setClientName(e.target.value as CompanyKey)} className={inputCls}>
              {(Object.keys(COMPANIES) as CompanyKey[]).map(key => <option key={key} value={key}>{COMPANIES[key].label}</option>)}
            </select>
            <select value={projectPriority} onChange={e => setProjectPriority(e.target.value as Priority)} className={inputCls}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={cn(inputCls, '[color-scheme:dark]')} />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
            <Button variant="glow" onClick={create} disabled={!name.trim()} leftIcon={<Plus className="w-4 h-4" />}>{t('createProject')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
