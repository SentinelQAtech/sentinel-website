'use client'

import { useMemo } from 'react'
import {
  BarChart2, Bell, BriefcaseBusiness, Bug, ClipboardCheck, FileText, Users,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useClients } from '@/hooks/useClients'
import { useNotifications } from '@/hooks/useNotifications'
import { useQAItems } from '@/hooks/useQAItems'
import { useProjects } from '@/hooks/useProjects'
import { useDashboardStats } from '@/hooks/useReports'
import { cn } from '@/lib/utils'

export function ReportsClient() {
  const { data: clients = [] } = useClients()
  const { data: qaItems = [] } = useQAItems()
  const { data: notificationsData } = useNotifications()
  const notifications = notificationsData ?? []
  const { data: stats } = useDashboardStats()
  const { data: projects = [] } = useProjects()

  const activeClients = clients.filter(client => client.status !== 'finished')
  const pendingQA = qaItems.filter(item => !item.sentToDaily && item.qaCategory !== 'Done')
  const sentQA = qaItems.filter(item => item.sentToDaily)
  const unreadNotifications = notifications.filter(notification => !notification.read)
  const teamMembers = stats?.teamMembers ?? 0

  const readiness = useMemo(() => [
    { label: 'Clientes ativos', value: activeClients.length, icon: BriefcaseBusiness, color: 'text-cyan-300' },
    { label: 'Time ativo', value: teamMembers, icon: Users, color: 'text-indigo-300' },
    { label: 'QA pendente', value: pendingQA.length, icon: ClipboardCheck, color: 'text-amber-300' },
    { label: 'Notificacoes abertas', value: unreadNotifications.length, icon: Bell, color: 'text-violet-300' },
  ], [activeClients.length, teamMembers, pendingQA.length, unreadNotifications.length])

  const operationalRows = [
    { label: 'Projetos ativos', value: projects.filter(project => project.status === 'ACTIVE').length, note: 'Projetos cadastrados na API' },
    { label: 'QA Items no board', value: qaItems.length, note: 'Itens QA importados/criados' },
    { label: 'Bugs abertos', value: stats?.openBugs ?? 0, note: 'Bugs registrados na API' },
    { label: 'QA enviados ao Daily', value: sentQA.length, note: `${pendingQA.length} pendentes na inbox` },
  ]

  const hasOperationalData = operationalRows.some(row => row.value > 0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-cyan-400" /> Relatorios
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Leitura operacional baseada nos dados da API do workspace.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/40">
          <FileText className="w-3.5 h-3.5" />
          Dados da API
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
            <p className="mt-1 text-xs text-white/30">Sincronizado com a API</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Resumo operacional</CardTitle>
            <span className="text-xs text-white/40">Projetos, board e bugs</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {operationalRows.map(row => (
                <div key={row.label} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    {row.label.includes('Bug') ? <Bug className="h-4 w-4 text-red-300" /> :
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
            <StatusLine label="Clientes cadastrados" ok={activeClients.length > 0} />
            <StatusLine label="Time cadastrado" ok={teamMembers > 0} />
            <StatusLine label="Projetos ativos" ok={projects.some(p => p.status === 'ACTIVE')} />
            <StatusLine label="Dados operacionais reais" ok={hasOperationalData} muted />
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
