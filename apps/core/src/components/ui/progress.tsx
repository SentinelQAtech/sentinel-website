import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'cyan' | 'emerald' | 'amber' | 'red'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const colorMap = {
  primary: 'from-indigo-500 to-violet-500',
  cyan:    'from-cyan-400 to-blue-500',
  emerald: 'from-emerald-400 to-teal-500',
  amber:   'from-amber-400 to-orange-500',
  red:     'from-red-400 to-rose-500',
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
}

export function Progress({ value, max = 100, size = 'md', color = 'primary', showLabel, animated, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 bg-white/[0.06] rounded-full overflow-hidden', sizeMap[size])}>
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            colorMap[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-white/60 tabular-nums w-9 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
