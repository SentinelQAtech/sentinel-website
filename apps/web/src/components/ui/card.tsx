import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  glow?: boolean
}

export function Card({ children, className, hover, onClick, glow }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card',
        hover && 'glass-card-hover cursor-pointer',
        glow && 'glow-primary',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between p-5 pb-0', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-sm font-semibold text-white/90', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  )
}

// Metric card for dashboard stats
interface MetricCardProps {
  title: string
  value: string | number
  delta?: { value: number; label: string }
  icon: React.ReactNode
  color?: 'indigo' | 'purple' | 'cyan' | 'emerald' | 'red' | 'amber'
  className?: string
}

const colorMap = {
  indigo:  { bg: 'bg-indigo-500/10',  icon: 'bg-indigo-500/20  text-indigo-400',  border: 'border-indigo-500/20'  },
  purple:  { bg: 'bg-purple-500/10',  icon: 'bg-purple-500/20  text-purple-400',  border: 'border-purple-500/20'  },
  cyan:    { bg: 'bg-cyan-500/10',    icon: 'bg-cyan-500/20    text-cyan-400',    border: 'border-cyan-500/20'    },
  emerald: { bg: 'bg-emerald-500/10', icon: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/20' },
  red:     { bg: 'bg-red-500/10',     icon: 'bg-red-500/20     text-red-400',     border: 'border-red-500/20'     },
  amber:   { bg: 'bg-amber-500/10',   icon: 'bg-amber-500/20   text-amber-400',   border: 'border-amber-500/20'   },
}

export function MetricCard({ title, value, delta, icon, color = 'indigo', className }: MetricCardProps) {
  const c = colorMap[color]
  return (
    <div className={cn('glass-card-hover p-5 border', c.border, className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
          {delta && (
            <p className={cn('text-xs mt-1.5', delta.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {delta.value >= 0 ? '↑' : '↓'} {Math.abs(delta.value)}% {delta.label}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl shrink-0', c.icon)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
