'use client'

import { cn } from '@/lib/utils'
import { LANGUAGE_OPTIONS, useI18nStore } from '@/store/i18n'

export function LanguageToggle() {
  const locale = useI18nStore(s => s.locale)
  const setLocale = useI18nStore(s => s.setLocale)

  return (
    <div className="flex h-8 items-center rounded-lg border border-white/[0.08] bg-white/[0.04] p-0.5">
      {LANGUAGE_OPTIONS.map(option => (
        <button
          key={option.locale}
          onClick={() => setLocale(option.locale)}
          className={cn(
            'flex h-7 w-8 items-center justify-center rounded-md text-sm transition-all duration-150',
            locale === option.locale
              ? 'bg-white/[0.10] shadow-sm'
              : 'opacity-45 hover:opacity-80'
          )}
          title={option.label}
        >
          {option.flag}
        </button>
      ))}
    </div>
  )
}
