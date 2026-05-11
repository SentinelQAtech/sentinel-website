'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useI18nStore } from '@/store/i18n'
import { ArrowUpRight, FolderKanban } from 'lucide-react'

const projects: { id: string; name: string }[] = []

export function ActiveProjects() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
        <Link href="/projects" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {projects.length === 0 ? (
          <div className="py-10 text-center">
            <FolderKanban className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <p className="text-sm text-white/35">{t('emptyProjects')}</p>
          </div>
        ) : (
          projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-200 group"
            >
              <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white">
                {p.name}
              </p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
