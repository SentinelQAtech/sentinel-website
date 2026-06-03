'use client'

import type React from 'react'
import Link from 'next/link'
import { Plus, Zap, ArrowUpRight, Users, Bug, KanbanSquare, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TEAM } from '@/lib/team-data'
import { useI18nStore } from '@/store/i18n'

const ACTIVE_TEAM = TEAM.filter(member => member.user.isActive)

export function SprintsClient() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-400" /> {t('sprintsTitle')}
          </h1>
          <p className="text-sm text-white/40 mt-0.5">0 {t('activeSprintsWithStatus')}</p>
        </div>
        <Button variant="glow" leftIcon={<Plus className="w-4 h-4" />}>{t('newSprint')}</Button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <Card>
            <CardContent className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">Nenhuma sprint real cadastrada</h2>
              <p className="mt-2 max-w-md text-sm text-white/40">
                A tela de Sprints foi limpa para nao exibir dados mockados. Quando conectarmos sprints reais,
                elas aparecerão aqui vinculadas aos seus projetos e cards.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <QuickLink href="/projects" icon={<FolderKanban className="w-4 h-4" />} label="Projetos" />
                <QuickLink href="/kanban" icon={<KanbanSquare className="w-4 h-4" />} label="Board" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Link href="/team" className="block glass-card-hover border border-white/[0.07]">
            <div className="flex items-center justify-between p-5 pb-0">
              <CardTitle>{t('realTeam')} ({ACTIVE_TEAM.length})</CardTitle>
              <ArrowUpRight className="w-4 h-4 text-white/35" />
            </div>
            <CardContent className="pt-3 space-y-3">
              {ACTIVE_TEAM.map(member => (
                <div key={member.user.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.025]">
                  <Avatar user={member.user} size="sm" showStatus isOnline />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">{member.user.name}</p>
                    <p className="text-xs text-white/35 truncate">{member.title}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: member.color }}>{member.sprintsCompleted}</span>
                </div>
              ))}
            </CardContent>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>{t('shortcuts')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 grid grid-cols-2 gap-2">
              <QuickLink href="/projects" icon={<FolderKanban className="w-4 h-4" />} label="Projects" />
              <QuickLink href="/bugs" icon={<Bug className="w-4 h-4" />} label="Bugs" />
              <QuickLink href="/kanban" icon={<KanbanSquare className="w-4 h-4" />} label="Board" />
              <QuickLink href="/team" icon={<Users className="w-4 h-4" />} label="Team" />
            </CardContent>
          </Card>
        </div>
      </div>
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
