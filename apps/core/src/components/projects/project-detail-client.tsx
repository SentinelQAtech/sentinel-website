'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, Bug, Calendar, CheckSquare, Clock, FolderKanban, Tags, User, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { PriorityBadge } from '@/components/ui/badge'
import { cn, formatDate, projectStatusConfig } from '@/lib/utils'
import { getCompany } from '@/lib/companies'
import { useProject } from '@/hooks/useProjects'

interface ProjectDetailClientProps {
  projectId: string
}

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const { data: project, isLoading } = useProject(projectId)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
        <p className="text-sm text-white/40">Carregando projeto...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <FolderKanban className="h-6 w-6 text-white/35" />
        </div>
        <h1 className="text-xl font-bold text-white">Projeto não encontrado</h1>
        <p className="mt-2 max-w-md text-sm text-white/40">
          Este projeto não existe neste workspace ou ainda não foi salvo localmente.
        </p>
        <Link
          href="/projects"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/15 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/25"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Projetos
        </Link>
      </div>
    )
  }

  const company = getCompany(project.clientName)
  const accent = company?.color ?? project.coverColor ?? '#6366f1'
  const status = projectStatusConfig[project.status]
  const counts = project._count ?? { tasks: 0, bugs: 0, sprints: 0 }

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-white/45 transition-colors hover:text-white/80">
          <ArrowLeft className="h-4 w-4" />
          Projetos
        </Link>
      </div>

      <section
        className="relative overflow-hidden rounded-2xl border bg-white/[0.018] p-5"
        style={{
          borderColor: `${accent}55`,
          boxShadow: `0 0 0 1px ${accent}1f, 0 20px 70px ${accent}10`,
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55, transparent)` }} />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {company && (
                <span className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold', company.bg, company.text, company.border)}>
                  <span>{company.flag}</span>
                  {company.label}
                </span>
              )}
              <span className={cn('rounded-lg px-2 py-1 text-xs font-semibold', status.bg, status.color)}>
                {status.label}
              </span>
              <PriorityBadge priority={project.priority} />
            </div>
            <h1 className="text-2xl font-bold leading-tight text-white">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/50">
              {project.description || 'Sem descrição cadastrada.'}
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 lg:w-72">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/35">Progresso</span>
              <span className="text-sm font-semibold text-white/75">{project.progress}%</span>
            </div>
            <Progress value={project.progress} size="md" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MetricCard icon={<CheckSquare className="h-4 w-4" />} label="Tasks" value={counts.tasks} accent="#6366f1" />
        <MetricCard icon={<Bug className="h-4 w-4" />} label="Bugs" value={counts.bugs} accent="#ef4444" />
        <MetricCard icon={<Zap className="h-4 w-4" />} label="Sprints" value={counts.sprints} accent="#06b6d4" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 xl:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white/85">Informações</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<User className="h-4 w-4" />} label="Responsável" value={project.owner?.name || '-'} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Criado em" value={formatDate(project.createdAt)} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Início" value={project.startDate ? formatDate(project.startDate) : '-'} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Fim" value={project.endDate ? formatDate(project.endDate) : '-'} />
          </div>
        </section>

        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <h2 className="mb-4 text-sm font-semibold text-white/85">Tags</h2>
          {project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-xs font-medium text-white/48">
                  <Tags className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/35">Nenhuma tag cadastrada.</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
        <h2 className="text-sm font-semibold text-white/85">Trabalho vinculado</h2>
        <p className="mt-2 text-sm text-white/40">
          Quando Tasks, Bugs e Sprints forem associados ao projeto, eles aparecem aqui como fila de trabalho do projeto.
        </p>
      </section>
    </div>
  )
}

function MetricCard({ icon, label, value, accent }: { icon: ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border bg-white/[0.02] p-4" style={{ borderColor: `${accent}33` }}>
      <div className="flex items-center justify-between">
        <span className="text-white/45" style={{ color: accent }}>{icon}</span>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/35">{label}</p>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/35">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
        <p className="truncate text-sm text-white/65">{value}</p>
      </div>
    </div>
  )
}
