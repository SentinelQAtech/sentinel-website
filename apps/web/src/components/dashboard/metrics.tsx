'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FolderKanban, Bug, CheckSquare, Zap, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nStore } from '@/store/i18n'
import { TEAM, TEAM_STORAGE_KEY, type TeamMember } from '@/lib/team-data'
import { useProjectsStore } from '@/store/projects'
import { useBugsStore } from '@/store/bugs'
import { useKanbanStore } from '@/store/kanban'

function useCounter(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        setValue(Math.round((1 - (1 - p) ** 3) * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return value
}

const colorMap = {
  indigo:  { border: 'border-indigo-500/20',  icon: 'bg-indigo-500/15 text-indigo-400',   glow: 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_24px_rgba(99,102,241,0.1)]',  bar: 'bg-indigo-500'  },
  purple:  { border: 'border-purple-500/20',  icon: 'bg-purple-500/15 text-purple-400',   glow: 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_24px_rgba(139,92,246,0.1)]',  bar: 'bg-purple-500'  },
  cyan:    { border: 'border-cyan-500/20',    icon: 'bg-cyan-500/15 text-cyan-400',       glow: 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_24px_rgba(6,182,212,0.1)]',   bar: 'bg-cyan-500'    },
  emerald: { border: 'border-emerald-500/20', icon: 'bg-emerald-500/15 text-emerald-400', glow: 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_24px_rgba(16,185,129,0.1)]',  bar: 'bg-emerald-500' },
  red:     { border: 'border-red-500/20',     icon: 'bg-red-500/15 text-red-400',         glow: 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_24px_rgba(239,68,68,0.1)]',   bar: 'bg-red-500'     },
  amber:   { border: 'border-amber-500/20',   icon: 'bg-amber-500/15 text-amber-400',     glow: 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_24px_rgba(245,158,11,0.1)]',  bar: 'bg-amber-500'   },
}

type ColorKey = keyof typeof colorMap

interface MetricItem {
  titleKey: string
  value: number
  delta: { value: number; labelKey: string }
  icon: ReactNode
  color: ColorKey
  href: string
}

const METRICS: MetricItem[] = [
  { titleKey: 'dashboardMetricActiveProjects', value: 0, delta: { value: 0, labelKey: 'noChange' }, icon: <FolderKanban className="w-4 h-4" />, color: 'indigo',  href: '/projects' },
  { titleKey: 'dashboardMetricOpenBugs',       value: 0, delta: { value: 0, labelKey: 'noChange' }, icon: <Bug className="w-4 h-4" />,          color: 'red',     href: '/bugs'     },
  { titleKey: 'dashboardMetricCriticalBugs',   value: 0, delta: { value: 0, labelKey: 'noChange' }, icon: <Bug className="w-4 h-4" />,          color: 'amber',   href: '/bugs'     },
  { titleKey: 'dashboardMetricTasksDone',      value: 0, delta: { value: 0, labelKey: 'noChange' }, icon: <CheckSquare className="w-4 h-4" />,  color: 'emerald', href: '/kanban'   },
  { titleKey: 'dashboardMetricActiveSprints',  value: 0, delta: { value: 0, labelKey: 'noChange' }, icon: <Zap className="w-4 h-4" />,          color: 'purple',  href: '/sprints'  },
  { titleKey: 'dashboardMetricTeamMembers',    value: 0, delta: { value: 0, labelKey: 'noChange' }, icon: <Users className="w-4 h-4" />,        color: 'cyan',    href: '/team'     },
]

function useTeamCount() {
  const [count, setCount] = useState(TEAM.filter(member => member.user.isActive).length)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TEAM_STORAGE_KEY)
      if (saved) {
        const members = JSON.parse(saved) as TeamMember[]
        setCount(members.filter(member => member.user.isActive).length)
      }
    } catch {
      setCount(TEAM.filter(member => member.user.isActive).length)
    }
  }, [])

  return count
}

function AnimatedMetricCard({ item, index }: { item: MetricItem; index: number }) {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const count  = useCounter(item.value, 900, index * 90)
  const router = useRouter()
  const c      = colorMap[item.color]
  const pos    = item.delta.value > 0
  const neg    = item.delta.value < 0
  const Icon   = pos ? TrendingUp : neg ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => router.push(item.href)}
      className={cn(
        'relative glass-card-hover p-5 border overflow-hidden group cursor-pointer',
        c.border, c.glow
      )}
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-px opacity-50', c.bar)} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2.5 truncate">
            {t(item.titleKey)}
          </p>
          <p className="text-3xl font-bold text-white tabular-nums leading-none">{count}</p>
          <div className={cn(
            'flex items-center gap-1 mt-2 text-[11px] font-medium',
            pos ? 'text-emerald-400' : neg ? 'text-red-400' : 'text-white/25'
          )}>
            <Icon className="w-3 h-3 shrink-0" />
            {item.delta.value !== 0 && <span>{Math.abs(item.delta.value)}%</span>}
            <span className="text-white/25 font-normal">{t(item.delta.labelKey)}</span>
          </div>
        </div>
        <div className={cn(
          'p-2.5 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110',
          c.icon
        )}>
          {item.icon}
        </div>
      </div>

      {/* Clickable hint */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/10 transition-all duration-300" />
    </motion.div>
  )
}

export function DashboardMetrics() {
  const teamCount = useTeamCount()
  const projectCount = useProjectsStore(s => s.projects.filter(project => project.status === 'ACTIVE').length)
  const openBugs = useBugsStore(s => s.bugs.filter(bug => bug.status !== 'RESOLVED' && bug.status !== 'CLOSED').length)
  const criticalBugs = useBugsStore(s => s.bugs.filter(bug => bug.severity === 'CRITICAL').length)
  const tasksDone = useKanbanStore(s => s.tasks.filter(task => task.status === 'DONE').length)
  const metrics = METRICS.map(item =>
    item.titleKey === 'dashboardMetricTeamMembers' ? { ...item, value: teamCount } :
    item.titleKey === 'dashboardMetricActiveProjects' ? { ...item, value: projectCount } :
    item.titleKey === 'dashboardMetricOpenBugs' ? { ...item, value: openBugs } :
    item.titleKey === 'dashboardMetricCriticalBugs' ? { ...item, value: criticalBugs } :
    item.titleKey === 'dashboardMetricTasksDone' ? { ...item, value: tasksDone } :
    item
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((item, i) => (
        <AnimatedMetricCard key={item.titleKey} item={item} index={i} />
      ))}
    </div>
  )
}
