import { Bug, AlertTriangle, CheckCircle2, Activity } from 'lucide-react'

interface BugStatsProps {
  stats: {
    total: number
    open: number
    critical: number
    resolved: number
  }
  active?: 'total' | 'open' | 'critical' | 'resolved'
  onFilter?: (filter: 'total' | 'open' | 'critical' | 'resolved') => void
}

export function BugStats({ stats, active = 'total', onFilter }: BugStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { key: 'total' as const,    label: 'Total Bugs', value: stats.total,    icon: <Bug className="w-5 h-5" />,           iconBg: 'bg-slate-500/20  text-slate-400',  border: 'border-slate-500/20'  },
        { key: 'open' as const,     label: 'Open',       value: stats.open,     icon: <Activity className="w-5 h-5" />,       iconBg: 'bg-red-500/20    text-red-400',    border: 'border-red-500/20'    },
        { key: 'critical' as const, label: 'Critical',   value: stats.critical, icon: <AlertTriangle className="w-5 h-5" />,  iconBg: 'bg-orange-500/20 text-orange-400', border: 'border-orange-500/20' },
        { key: 'resolved' as const, label: 'Resolved',   value: stats.resolved, icon: <CheckCircle2 className="w-5 h-5" />,  iconBg: 'bg-emerald-500/20 text-emerald-400',border: 'border-emerald-500/20'},
      ].map(({ key, label, value, icon, iconBg, border }) => (
        <button
          key={label}
          onClick={() => onFilter?.(key)}
          className={`glass-card p-5 border text-left hover:bg-white/[0.04] transition-all duration-150 ${border} ${active === key ? 'ring-1 ring-primary/40' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">{label}</p>
              <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
