'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useI18nStore } from '@/store/i18n'
import { useProjects } from '@/hooks/useProjects'
import { useSprints } from '@/hooks/useSprints'
import { Zap, Clock, ArrowRight, Loader2 } from 'lucide-react'

function daysLeft(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
}

export function SprintProgress() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  const { data: projects, isLoading: projectsLoading } = useProjects()
  const firstProjectId = projects?.[0]?.id ?? ''
  const { data: sprints = [], isLoading: sprintsLoading } = useSprints(firstProjectId)

  const activeSprints = sprints.filter(s => s.status === 'ACTIVE')
  const projectMap = new Map(projects?.map(p => [p.id, p]) ?? [])
  const loading = projectsLoading || sprintsLoading

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <CardTitle>Active Sprints</CardTitle>
        </div>
        <Link
          href="/sprints"
          className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors duration-150"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pt-4 flex-1">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
          </div>
        ) : activeSprints.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-10 text-center">
            <div>
              <Zap className="w-8 h-8 mx-auto mb-3 text-white/20" />
              <p className="text-sm text-white/35">{t('emptySprints')}</p>
            </div>
          </div>
        ) : (
          activeSprints.map((sprint) => {
            const project = projectMap.get(sprint.projectId)
            const dl = daysLeft(sprint.endDate)
            const urgency = dl <= 3
            const color = project?.coverColor ?? '#6366f1'

            return (
              <div key={sprint.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href="/sprints"
                      className="group inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors duration-150"
                    >
                      <span
                        className="group-hover:underline decoration-[0.5px] underline-offset-2"
                        style={{ textDecorationColor: color }}
                      >
                        {sprint.name}
                      </span>
                    </Link>
                    <p className="text-xs text-white/40">{project?.name ?? 'Projeto'}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${urgency ? 'text-red-400' : 'text-white/50'}`}>
                    <Clock className="w-3 h-3" />
                    {dl}d left
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
