'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useI18nStore } from '@/store/i18n'
import { Zap, Clock, ArrowRight } from 'lucide-react'

const sprints: {
  name: string
  project: string
  done: number
  total: number
  daysLeft: number
  color: string
  href: string
}[] = []

export function SprintProgress() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

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
        {sprints.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-10 text-center">
            <div>
              <Zap className="w-8 h-8 mx-auto mb-3 text-white/20" />
              <p className="text-sm text-white/35">{t('emptySprints')}</p>
            </div>
          </div>
        ) : (
          sprints.map((sprint) => {
            const pct = Math.round((sprint.done / sprint.total) * 100)
            const urgency = sprint.daysLeft <= 3

            return (
              <div key={sprint.name} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={sprint.href}
                      className="group inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors duration-150"
                    >
                      <span
                        className="group-hover:underline decoration-[0.5px] underline-offset-2"
                        style={{ textDecorationColor: sprint.color }}
                      >
                        {sprint.name}
                      </span>
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs"
                        style={{ color: sprint.color }}
                      >
                        open
                      </span>
                    </Link>
                    <p className="text-xs text-white/40">{sprint.project}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${urgency ? 'text-red-400' : 'text-white/50'}`}>
                    <Clock className="w-3 h-3" />
                    {sprint.daysLeft}d left
                  </div>
                </div>

                <Progress value={sprint.done} max={sprint.total} size="md" showLabel />

                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>{sprint.done} / {sprint.total} tasks done</span>
                  <span className="text-white/60 font-medium">{pct}%</span>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
