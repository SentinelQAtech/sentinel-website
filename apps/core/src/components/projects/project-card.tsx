'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bug, CheckSquare, Zap, MoreHorizontal, Calendar, Trash2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { PriorityBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn, projectStatusConfig, formatDate } from '@/lib/utils'
import { getCompany } from '@/lib/companies'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  view?: 'grid' | 'list'
  onDeleteRequest?: (project: Project) => void
}

export function ProjectCard({ project, view = 'grid', onDeleteRequest }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const statusCfg = projectStatusConfig[project.status]
  const company = getCompany(project.clientName)

  if (view === 'list') {
    return (
      <Link
        href={`/projects/${project.id}`}
        className={cn(
          'flex items-center gap-4 p-4 glass-card-hover group relative overflow-hidden',
          company && company.glow
        )}
      >
        {/* Company left border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
          style={{ backgroundColor: company ? company.color : project.coverColor }}
        />

        {/* Cover color dot */}
        <div className="w-1 h-12 rounded-full shrink-0 ml-2" style={{ backgroundColor: project.coverColor }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="text-sm font-semibold text-white/90 group-hover:text-white truncate">{project.name}</p>
            <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', statusCfg.bg, statusCfg.color)}>
              {statusCfg.label}
            </span>
          </div>
          <p className="text-xs text-white/40 truncate">{project.description}</p>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {/* Company badge */}
          {company && (
            <span className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border',
              company.bg, company.text, company.border
            )}>
              <span>{company.flag}</span>
              {company.short}
            </span>
          )}

          <PriorityBadge priority={project.priority} />

          <div className="flex items-center gap-1 text-xs text-white/40">
            <Bug className="w-3 h-3" />
            <span>{project._count?.bugs ?? 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <CheckSquare className="w-3 h-3" />
            <span>{project._count?.tasks ?? 0}</span>
          </div>

          <div className="w-32 flex items-center gap-2">
            <Progress value={project.progress} size="sm" className="flex-1" />
            <span className="text-xs text-white/50 w-8 text-right">{project.progress}%</span>
          </div>

          <Avatar user={project.owner} size="sm" />
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onDeleteRequest?.(project)
            }}
            className="p-1.5 rounded-lg text-white/25 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
            title="Excluir projeto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </Link>
    )
  }

  // ── Grid card ────────────────────────────────────────────────────────────────
  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        'glass-card-hover p-5 flex flex-col gap-4 group relative overflow-hidden',
        company && company.glow
      )}
    >
      {/* Company left border */}
      {company && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: company.color, opacity: 0.8 }}
        />
      )}

      {/* Top gradient band (cover color) */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-70"
        style={{ background: `linear-gradient(90deg, ${project.coverColor}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 font-bold"
            style={{ backgroundColor: project.coverColor + '20', border: `1px solid ${project.coverColor}30` }}
          >
            {project.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/90 group-hover:text-white leading-tight">
              {project.name}
            </p>
            {/* Company badge inline below name */}
            {company ? (
              <span className={cn(
                'inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border',
                company.bg, company.text, company.border
              )}>
                {company.flag} {company.label}
              </span>
            ) : project.clientName ? (
              <p className="text-xs text-white/35 mt-0.5">{project.clientName}</p>
            ) : null}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setMenuOpen(v => !v)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all duration-150 shrink-0"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 w-40 dropdown-panel border border-white/[0.08] overflow-hidden">
              <button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMenuOpen(false)
                  onDeleteRequest?.(project)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir projeto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-white/45 leading-relaxed line-clamp-2 pl-1">{project.description}</p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-1">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.05] text-white/40 border border-white/[0.06]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="pl-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">Progress</span>
          <span className="text-xs font-medium text-white/70">{project.progress}%</span>
        </div>
        <Progress value={project.progress} size="md" />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] pl-1">
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Bug className="w-3 h-3" /> {project._count?.bugs ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3 h-3" /> {project._count?.tasks ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" /> {project._count?.sprints ?? 0}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', statusCfg.bg, statusCfg.color)}>
            {statusCfg.label}
          </span>
          <PriorityBadge priority={project.priority} />
        </div>
      </div>

      {/* Due date */}
      {project.endDate && (
        <div className="flex items-center gap-1 text-[10px] text-white/25 pl-1">
          <Calendar className="w-3 h-3" />
          Due {formatDate(project.endDate)}
        </div>
      )}
    </Link>
  )
}
