export const COMPANIES = {
  'Concept-USA': {
    label: 'Concept-USA',
    short: 'CON',
    flag: '🇺🇸',
    color: '#3b82f6',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]',
  },
  'ABinBev-IND': {
    label: 'ABinBev-IND',
    short: 'ABI',
    flag: '🇮🇳',
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  },
  'ScrumLaunch-UKR': {
    label: 'ScrumLaunch-UKR',
    short: 'SCR',
    flag: '🇺🇦',
    color: '#06b6d4',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.15)]',
  },
} as const

export type CompanyKey = keyof typeof COMPANIES

export function getCompany(name?: string | null) {
  if (!name) return null
  return COMPANIES[name as CompanyKey] ?? null
}
