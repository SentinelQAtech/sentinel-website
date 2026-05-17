'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useI18nStore } from '@/store/i18n'
import { useBugsStore } from '@/store/bugs'
import Link from 'next/link'
import { ArrowUpRight, AlertTriangle } from 'lucide-react'

export function CriticalBugs() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const allBugs = useBugsStore(s => s.bugs)
  const bugs = useMemo(
    () => allBugs.filter(bug => bug.severity === 'CRITICAL' || bug.severity === 'HIGH'),
    [allBugs]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <CardTitle>Critical & High Bugs</CardTitle>
        </div>
        <Link href="/bugs?severity=CRITICAL,HIGH" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {bugs.length === 0 ? (
          <div className="py-10 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <p className="text-sm text-white/35">{t('emptyBugs')}</p>
          </div>
        ) : (
          bugs.map((bug) => (
            <Link
              key={bug.id}
              href={`/bugs/${bug.id}`}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-white/40 font-mono">{bug.bugId}</span>
                </div>
                <p className="text-sm text-white/80 group-hover:text-white truncate">{bug.title}</p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
