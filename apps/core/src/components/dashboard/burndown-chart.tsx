'use client'

import { GitBranch } from 'lucide-react'
import { useI18nStore } from '@/store/i18n'

export function BurndownChart() {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)

  return (
    <div className="glass-card border border-white/[0.07] p-5 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/85">Burndown</h3>
          <p className="text-[10px] text-white/35">{t('emptySprints')}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <GitBranch className="w-9 h-9 mx-auto mb-3 text-white/15" />
          <p className="text-sm text-white/35">{t('emptySprints')}</p>
        </div>
      </div>
    </div>
  )
}
