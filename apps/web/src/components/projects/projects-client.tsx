'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Grid2X2, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectCard } from './project-card'
import { cn } from '@/lib/utils'
import { COMPANIES, type CompanyKey } from '@/lib/companies'
import type { Project } from '@/types'

const owner1 = { id: '1', email: 'rapha@sentinel.tech', username: 'raphacastilho', name: 'Raphael Castilho', role: 'ADMIN' as const, isActive: true, createdAt: '' }
const owner2 = { id: '2', email: 'antonio@sentinel.tech', username: 'antoniosilva', name: 'Antonio Silva', role: 'DEVELOPER' as const, isActive: true, createdAt: '' }

const mockProjects: Project[] = [
  {
    id: '1', name: 'E-Commerce Platform',
    description: 'Full rewrite of the US storefront with Next.js, Stripe and headless CMS.',
    status: 'ACTIVE', priority: 'HIGH',
    progress: 68, tags: ['react', 'stripe', 'cms'],
    clientName: 'Concept-USA', coverColor: '#3b82f6',
    ownerId: '1', owner: owner1, members: [],
    startDate: '2026-01-01', endDate: '2026-09-30',
    _count: { tasks: 142, bugs: 12, sprints: 14 },
    createdAt: '2026-01-01', updatedAt: '2026-05-06',
  },
  {
    id: '2', name: 'Design System',
    description: 'Component library and brand tokens for all Concept-USA digital products.',
    status: 'PAUSED', priority: 'LOW',
    progress: 31, tags: ['design', 'storybook', 'tokens'],
    clientName: 'Concept-USA', coverColor: '#60a5fa',
    ownerId: '1', owner: owner1, members: [],
    startDate: '2026-03-01', endDate: '2026-10-31',
    _count: { tasks: 38, bugs: 2, sprints: 2 },
    createdAt: '2026-03-01', updatedAt: '2026-04-28',
  },
  {
    id: '3', name: 'Brewery QA Automation',
    description: 'End-to-end Playwright suite covering 400+ test cases across production lines.',
    status: 'ACTIVE', priority: 'CRITICAL',
    progress: 42, tags: ['qa', 'playwright', 'automation'],
    clientName: 'ABinBev-IND', coverColor: '#f59e0b',
    ownerId: '2', owner: owner2, members: [],
    startDate: '2026-02-01', endDate: '2026-07-31',
    _count: { tasks: 87, bugs: 18, sprints: 9 },
    createdAt: '2026-02-01', updatedAt: '2026-05-06',
  },
  {
    id: '4', name: 'Supply Chain Dashboard',
    description: 'Real-time logistics monitoring dashboard for India distribution network.',
    status: 'ACTIVE', priority: 'HIGH',
    progress: 57, tags: ['dashboard', 'realtime', 'logistics'],
    clientName: 'ABinBev-IND', coverColor: '#fbbf24',
    ownerId: '1', owner: owner1, members: [],
    startDate: '2026-02-15', endDate: '2026-08-15',
    _count: { tasks: 71, bugs: 6, sprints: 5 },
    createdAt: '2026-02-15', updatedAt: '2026-05-05',
  },
  {
    id: '5', name: 'Sprint Tracker App',
    description: 'Internal tool for Ukraine dev team — sprint planning, velocity and daily standups.',
    status: 'ACTIVE', priority: 'MEDIUM',
    progress: 85, tags: ['agile', 'nestjs', 'react'],
    clientName: 'ScrumLaunch-UKR', coverColor: '#06b6d4',
    ownerId: '1', owner: owner1, members: [],
    startDate: '2026-03-01', endDate: '2026-06-30',
    _count: { tasks: 54, bugs: 4, sprints: 3 },
    createdAt: '2026-03-01', updatedAt: '2026-05-06',
  },
  {
    id: '6', name: 'Client Portal v3',
    description: 'Revamped portal for ScrumLaunch clients — real-time project status and reports.',
    status: 'COMPLETED', priority: 'MEDIUM',
    progress: 100, tags: ['portal', 'next.js', 'reporting'],
    clientName: 'ScrumLaunch-UKR', coverColor: '#22d3ee',
    ownerId: '2', owner: owner2, members: [],
    startDate: '2025-10-01', endDate: '2026-03-31',
    _count: { tasks: 93, bugs: 1, sprints: 6 },
    createdAt: '2025-10-01', updatedAt: '2026-03-31',
  },
]

type ViewMode = 'grid' | 'list'
type FilterStatus = 'ALL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
type FilterCompany = 'ALL' | CompanyKey

export function ProjectsClient() {
  const [search, setSearch]       = useState('')
  const [view, setView]           = useState<ViewMode>('grid')
  const [status, setStatus]       = useState<FilterStatus>('ALL')
  const [company, setCompany]     = useState<FilterCompany>('ALL')

  const filtered = mockProjects.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.description?.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = status === 'ALL' || p.status === status
    const matchCompany = company === 'ALL' || p.clientName === company
    return matchSearch && matchStatus && matchCompany
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-white/40 mt-0.5">{filtered.length} of {mockProjects.length} projects</p>
        </div>
        <Button variant="glow" leftIcon={<Plus className="w-4 h-4" />}>
          New Project
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
          All clients
        </button>

        {/* Per company */}
        {(Object.keys(COMPANIES) as CompanyKey[]).map(key => {
          const c = COMPANIES[key]
          const isActive = company === key
          const count = mockProjects.filter(p => p.clientName === key).length
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
            placeholder="Search projects..."
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
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-150">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
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
            <ProjectCard project={project} view={view} />
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4 text-3xl">
              {company !== 'ALL' ? COMPANIES[company as CompanyKey].flag : '🔍'}
            </div>
            <p className="text-white/50 font-medium">No projects found</p>
            <p className="text-white/30 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
