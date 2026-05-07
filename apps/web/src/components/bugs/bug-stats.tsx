import { Bug, AlertTriangle, CheckCircle2, Activity } from 'lucide-react'

interface BugStatsProps {
  stats: {
    total: number
    open: number
    critical: number
    resolved: number
  }
}

export function BugStats({ stats }: BugStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Total Bugs',   value: stats.total,    icon: <Bug className="w-5 h-5" />,           bg: 'bg-slate-500/10',   iconBg: 'bg-slate-500/20  text-slate-400',  border: 'border-slate-500/20'  },
        { label: 'Open',         value: stats.open,     icon: <Activity className="w-5 h-5" />,       bg: 'bg-red-500/10',     iconBg: 'bg-red-500/20    text-red-400',    border: 'border-red-500/20'    },
        { label: 'Critical',     value: stats.critical, icon: <AlertTriangle className="w-5 h-5" />,  bg: 'bg-orange-500/10',  iconBg: 'bg-orange-500/20 text-orange-400', border: 'border-orange-500/20' },
        { label: 'Resolved',     value: stats.resolved, icon: <CheckCircle2 className="w-5 h-5" />,  bg: 'bg-emerald-500/10', iconBg: 'bg-emerald-500/20 text-emerald-400',border: 'border-emerald-500/20'},
      ].map(({ label, value, icon, bg, iconBg, border }) => (
        <div key={label} className={`glass-card p-5 border ${border}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">{label}</p>
              <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
