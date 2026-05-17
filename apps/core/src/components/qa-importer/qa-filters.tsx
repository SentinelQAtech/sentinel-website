'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QAPriority, QACategory } from '@/store/qa-importer'

export interface QAFilterState {
  search:      string
  client:      string
  priority:    QAPriority | ''
  category:    QACategory | ''
  sprint:      string
  sentToDaily: 'all' | 'yes' | 'no'
  sortBy:      'priority' | 'newest' | 'client' | 'sprint'
}

export const DEFAULT_FILTERS: QAFilterState = {
  search: '', client: '', priority: '', category: '',
  sprint: '', sentToDaily: 'all', sortBy: 'priority',
}

interface Props {
  filters:          QAFilterState
  onChange:         (f: QAFilterState) => void
  availableClients: string[]
  availableSprints: string[]
  total:            number
  filtered:         number
}

const PRIORITIES: (QAPriority | '')[] = ['', 'Critical', 'High', 'Medium', 'Low']
const CATEGORIES: (QACategory | '')[] = ['', 'Ready for QA', 'In Testing', 'Bug Validation', 'Regression', 'Review', 'Blocked', 'Done', 'Other']

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#10b981',
}

const SORT_OPTIONS = [
  { value: 'priority', label: 'Prioridade' },
  { value: 'newest',   label: 'Mais recente' },
  { value: 'client',   label: 'Cliente' },
  { value: 'sprint',   label: 'Sprint' },
] as const

export function QAFiltersBar({ filters, onChange, availableClients, availableSprints, total, filtered }: Props) {
  const set = <K extends keyof QAFilterState>(key: K, val: QAFilterState[K]) =>
    onChange({ ...filters, [key]: val })

  const hasActiveFilters = filters.search || filters.client || filters.priority ||
    filters.category || filters.sprint || filters.sentToDaily !== 'all'

  const reset = () => onChange({ ...DEFAULT_FILTERS, sortBy: filters.sortBy })

  return (
    <div className="space-y-3">
      {/* Search + sort row */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            placeholder="Buscar por título ou issue key..."
            className={cn(
              'w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08]',
              'text-white placeholder-white/20 outline-none',
              'focus:border-primary/40 focus:ring-1 focus:ring-primary/15 transition-all duration-150',
            )}
          />
          {filters.search && (
            <button
              onClick={() => set('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/30" />
          <select
            value={filters.sortBy}
            onChange={e => set('sortBy', e.target.value as QAFilterState['sortBy'])}
            className={cn(
              'text-xs bg-white/[0.04] border border-white/[0.08] text-white/60 rounded-lg px-2 py-2',
              'outline-none focus:border-primary/40 transition-all duration-150 [color-scheme:dark]',
            )}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Sent to Daily toggle */}
        <div className="flex items-center gap-1 text-xs rounded-lg border border-white/[0.08] overflow-hidden">
          {(['all', 'no', 'yes'] as const).map(v => (
            <button
              key={v}
              onClick={() => set('sentToDaily', v)}
              className={cn(
                'px-2.5 py-1.5 transition-all duration-150',
                filters.sentToDaily === v
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/40 hover:text-white/60',
              )}
            >
              {v === 'all' ? 'Todos' : v === 'yes' ? '✓ Daily' : 'Pendentes'}
            </button>
          ))}
        </div>

        {/* Result count + clear */}
        <div className="flex items-center gap-2 ml-auto text-[11px] text-white/30">
          {filtered !== total && (
            <span><span className="text-white/60 font-semibold">{filtered}</span> / {total}</span>
          )}
          {hasActiveFilters && (
            <button onClick={reset} className="text-primary/70 hover:text-primary transition-colors duration-150 flex items-center gap-1">
              <X className="w-3 h-3" />limpar
            </button>
          )}
        </div>
      </div>

      {/* Chip filters */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Priority chips */}
        {PRIORITIES.map(p => (
          <button
            key={p || 'all-p'}
            onClick={() => set('priority', p)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150',
              filters.priority === p
                ? p ? '' : 'bg-white/10 border-white/20 text-white/70'
                : 'border-white/[0.08] text-white/35 hover:text-white/60',
            )}
            style={filters.priority === p && p ? {
              backgroundColor: PRIORITY_COLORS[p] + '25',
              borderColor:     PRIORITY_COLORS[p] + '50',
              color:           PRIORITY_COLORS[p],
            } : {}}
          >
            {p || 'All Priorities'}
          </button>
        ))}

        <span className="text-white/15 mx-1">|</span>

        {/* Category chips */}
        {CATEGORIES.map(c => (
          <button
            key={c || 'all-c'}
            onClick={() => set('category', c)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150',
              filters.category === c
                ? 'bg-primary/15 border-primary/30 text-primary'
                : 'border-white/[0.08] text-white/35 hover:text-white/60',
            )}
          >
            {c || 'All Categories'}
          </button>
        ))}

        {/* Client filter */}
        {availableClients.length > 0 && (
          <>
            <span className="text-white/15 mx-1">|</span>
            {availableClients.map(cl => (
              <button
                key={cl}
                onClick={() => set('client', filters.client === cl ? '' : cl)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150',
                  filters.client === cl
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                    : 'border-white/[0.08] text-white/35 hover:text-white/60',
                )}
              >
                {cl}
              </button>
            ))}
          </>
        )}

        {/* Sprint filter */}
        {availableSprints.length > 0 && (
          <>
            <span className="text-white/15 mx-1">|</span>
            {availableSprints.map(sp => (
              <button
                key={sp}
                onClick={() => set('sprint', filters.sprint === sp ? '' : sp)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150',
                  filters.sprint === sp
                    ? 'bg-violet-500/15 border-violet-500/30 text-violet-400'
                    : 'border-white/[0.08] text-white/35 hover:text-white/60',
                )}
              >
                {sp}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
