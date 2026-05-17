'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BarChart2, Bell, BriefcaseBusiness, Bug, CheckCircle2,
  ClipboardCheck, FileText, Users,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useCompaniesStore } from '@/store/companies'
import { useNotificationsStore } from '@/store/notifications'
import { useQAImporterStore } from '@/store/qa-importer'
import { useProjectsStore } from '@/store/projects'
import { useBugsStore } from '@/store/bugs'
import { useKanbanStore } from '@/store/kanban'
import { TEAM, TEAM_STORAGE_KEY, type TeamMember } from '@/lib/team-data'
import { cn } from '@/lib/utils'

function useRealTeam() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TEAM_STORAGE_KEY)
      if (saved) setMembers(JSON.parse(saved) as TeamMember[])
    } catch {
      setMembers(TEAM)
    }
  }, [])

  return members
}

export function ReportsClient() {
  const companies = useCompaniesStore(s => s.companies)
  const qaItems = useQAImporterStore(s => s.items)
  const imports = useQAImporterStore(s => s.history)
  const notifications = useNotificationsStore(s => s.notifications)
  const projects = useProjectsStore(s => s.projects)
  const bugs = useBugsStore(s => s.bugs)
  const tasks = useKanbanStore(s => s.tasks)
  const members = useRealTeam()

  const activeCompanies = companies.filter(company => company.status !== 'finished')
  const activeMembers = members.filter(member => member.user.isActive)
  const pendingQA = qaItems.filter(item => !item.sentToDaily)
  const sentQA = qaItems.filter(item => item.sentToDaily)
  const unreadNotifications = notifications.filter(notification => !notification.read)

  const readiness = useMemo(() => [
    { label: 'Clientes ativos', value: activeCompanies.length, icon: BriefcaseBusiness, color: 'text-cyan-300', href: '/companies' },
    { label: 'Time ativo', value: activeMembers.length, icon: Users, color: 'text-indigo-300', href: '/team' },
    { label: 'QA pendente', value: pendingQA.length, icon: ClipboardCheck, color: 'text-amber-300', href: '/qa-importer' },
    { label: 'Notificacoes abertas', value: unreadNotifications.length, icon: Bell, color: 'text-violet-300', href: '/notifications' },
  ], [activeCompanies.length, activeMembers.length, pendingQA.length, unreadNotifications.length])

  const operationalRows = [
    { label: 'Projetos ativos', value: projects.filter(project => project.status === 'ACTIVE').length, note: 'Projetos cadastrados manualmente' },
    { label: 'Tasks no board', value: tasks.length, note: 'Inclui cards importados do QA Importer' },
    { label: 'Bugs abertos', value: bugs.filter(bug => bug.status !== 'RESOLVED' && bug.status !== 'CLOSED').length, note: 'Bugs registrados e importados' },
    { label: 'Itens QA importados', value: qaItems.length, note: `${pendingQA.length} pendentes, ${sentQA.length} enviados ao Daily` },
  ]

  const hasOperationalData = operationalRows.some(row => row.value > 0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-cyan-400" /> Relatorios
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Leitura operacional baseada apenas nos dados cadastrados no sistema.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/40">
          <FileText className="w-3.5 h-3.5" />
          Dados reais
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {readiness.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5 border border-white/[0.07]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">{label}</span>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <p className="mt-3 text-3xl font-bold text-white tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-white/30">Atualizado em tempo real local</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Resumo operacional</CardTitle>
            <span className="text-xs text-white/40">Projetos, board, bugs e importacoes</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {operationalRows.map(row => (
                <div key={row.label} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    {row.label.includes('Bug') ? <Bug className="h-4 w-4 text-red-300" /> :
                      row.label.includes('Tasks') ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> :
                        row.label.includes('QA') ? <ClipboardCheck className="h-4 w-4 text-amber-300" /> :
                          <BriefcaseBusiness className="h-4 w-4 text-cyan-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/80">{row.label}</p>
                      <span className="text-xl font-bold text-white tabular-nums">{row.value}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/35">{row.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saude dos dados</CardTitle>
            <span className="text-xs text-white/40">Pronto para uso real</span>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <StatusLine label="Base demo removida" ok />
            <StatusLine label="Clientes cadastrados" ok={activeCompanies.length > 0} />
            <StatusLine label="Time cadastrado" ok={activeMembers.length > 0} />
            <StatusLine label="Dados operacionais reais" ok={hasOperationalData} muted />

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Ultimas importacoes</p>
              {imports.length === 0 ? (
                <p className="mt-3 text-sm text-white/35">Nenhuma importacao realizada ainda.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {imports.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-white/45">{item.source}</span>
                      <span className="font-semibold text-white/70">{item.qaCount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatusLine({ label, ok, muted }: { label: string; ok: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn('text-sm', muted ? 'text-white/35' : 'text-white/55')}>{label}</span>
      <span className={cn(
        'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
        ok
          ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
          : 'border-white/[0.08] bg-white/[0.03] text-white/35'
      )}>
        {ok ? 'OK' : 'Pendente'}
      </span>
    </div>
  )
}
