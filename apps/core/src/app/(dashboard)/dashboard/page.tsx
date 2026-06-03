'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bug, CalendarDays, Gauge, SlidersHorizontal, Sun, Target } from 'lucide-react'
import { DashboardMetrics }   from '@/components/dashboard/metrics'
import { BugTrendChart }      from '@/components/dashboard/bug-trend-chart'
import { SprintProgress }     from '@/components/dashboard/sprint-progress'
import { RecentActivity }     from '@/components/dashboard/recent-activity'
import { ActiveProjects }     from '@/components/dashboard/active-projects'
import { TeamPresence }       from '@/components/dashboard/team-presence'
import { CriticalBugs }       from '@/components/dashboard/critical-bugs'
import { SentinelAI }         from '@/components/dashboard/sentinel-ai'
import { TodayDailyWidget }      from '@/components/dashboard/today-daily-widget'
import { DailyProgressWidget }   from '@/components/dashboard/daily-progress-widget'
import { DailyTasksWidget }      from '@/components/dashboard/daily-tasks-widget'
import { DailyMeetingsWidget }   from '@/components/dashboard/daily-meetings-widget'
import { CalendarWidget }     from '@/components/dashboard/calendar-widget'
import { QATodayWidget }      from '@/components/dashboard/qa-today-widget'
import { QAQuickAction }      from '@/components/dashboard/qa-quick-action'
import { ActivityHeatmap }    from '@/components/dashboard/activity-heatmap'
import { BurndownChart }      from '@/components/dashboard/burndown-chart'
import { QACoverageDonut }    from '@/components/dashboard/qa-coverage-donut'
import { LayoutEditor }       from '@/components/dashboard/layout-editor'
import { useAuthStore }           from '@/store/auth'
import { useDashboardLayoutStore } from '@/store/dashboard-layout'
import { cn, formatDate } from '@/lib/utils'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

const FULL_WIDTH = new Set(['daily', 'metrics', 'sentinel-ai'])

const WIDGET_COL: Record<string, string> = {
  'daily-progress':   'col-span-12 lg:col-span-3',
  'daily-tasks':      'col-span-12 lg:col-span-5',
  'daily-meetings':   'col-span-12 lg:col-span-4',
  'bug-trend':        'col-span-12 lg:col-span-8',
  'sprint':           'col-span-12 lg:col-span-4',
  'active-projects':  'col-span-12 lg:col-span-7',
  'team-presence':    'col-span-12 lg:col-span-5',
  'critical-bugs':    'col-span-12 lg:col-span-3',
  'recent-activity':  'col-span-12 lg:col-span-3',
  'calendar':         'col-span-12 lg:col-span-3',
  'qa-today':          'col-span-12 lg:col-span-3',
  'qa-quick-action':   'col-span-12 lg:col-span-4',
  'activity-heatmap':  'col-span-12 lg:col-span-8',
  'burndown':          'col-span-12 lg:col-span-6',
  'qa-donut':          'col-span-12 lg:col-span-4',
}

const SIZE_COL: Record<string, string> = {
  'sm':   'col-span-12 lg:col-span-3',
  'md':   'col-span-12 lg:col-span-4',
  'lg':   'col-span-12 lg:col-span-6',
  'xl':   'col-span-12 lg:col-span-8',
  'full': 'col-span-12',
}

const HEIGHT_CLASS: Record<string, string> = {
  '1': 'h-40',
  '2': 'h-64',
  '3': 'h-[26rem]',
  '4': 'h-[36rem]',
}

type DashboardFilter = 'all' | 'daily' | 'qa' | 'risks' | 'sprint'

const FILTERS: { id: DashboardFilter; label: string; icon: React.ElementType; widgets: string[] }[] = [
  { id: 'all',    label: 'Tudo',   icon: Gauge,        widgets: [] },
  { id: 'daily',  label: 'Daily',  icon: Sun,          widgets: ['daily', 'daily-progress', 'daily-tasks', 'daily-meetings', 'calendar'] },
  { id: 'qa',     label: 'QA',     icon: Bug,          widgets: ['qa-quick-action', 'qa-today', 'qa-donut', 'critical-bugs', 'bug-trend'] },
  { id: 'risks',  label: 'Riscos', icon: Target,       widgets: ['sentinel-ai', 'critical-bugs', 'qa-today', 'daily-progress', 'recent-activity'] },
  { id: 'sprint', label: 'Sprint', icon: CalendarDays, widgets: ['sprint', 'burndown', 'active-projects', 'activity-heatmap', 'team-presence'] },
]

function WidgetNode({ id }: { id: string }) {
  switch (id) {
    case 'daily':           return <TodayDailyWidget />
    case 'daily-progress':  return <DailyProgressWidget />
    case 'daily-tasks':     return <DailyTasksWidget />
    case 'daily-meetings':  return <DailyMeetingsWidget />
    case 'metrics':         return <DashboardMetrics />
    case 'sentinel-ai':     return <SentinelAI />
    case 'bug-trend':       return <BugTrendChart />
    case 'sprint':          return <SprintProgress />
    case 'active-projects': return <ActiveProjects />
    case 'team-presence':   return <TeamPresence />
    case 'critical-bugs':   return <CriticalBugs />
    case 'recent-activity': return <RecentActivity />
    case 'calendar':        return <CalendarWidget />
    case 'qa-today':        return <QATodayWidget />
    case 'qa-quick-action': return <QAQuickAction />
    case 'activity-heatmap':return <ActivityHeatmap />
    case 'burndown':        return <BurndownChart />
    case 'qa-donut':        return <QACoverageDonut />
    default:                return null
  }
}

export default function DashboardPage() {
  const user      = useAuthStore(s => s.user)
  const userId    = user?.id ?? 'guest'
  const firstName = user?.name.split(' ')[0] ?? ''

  const { getLayout } = useDashboardLayoutStore()
  const layout = getLayout(userId)

  const [editorOpen, setEditorOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>('all')

  const filterIds = FILTERS.find(f => f.id === activeFilter)?.widgets ?? []
  const visible       = layout.filter(w => w.visible && (activeFilter === 'all' || filterIds.includes(w.id)))
  const fullWidthList = visible.filter(w => FULL_WIDTH.has(w.id))
  const gridList      = visible.filter(w => !FULL_WIDTH.has(w.id))

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Welcome header */}
        <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting()},{' '}
              <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              Veja o que está acontecendo nos seus projetos hoje.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right text-xs text-white/30 hidden sm:block">
              <p className="font-medium text-white/50">
                {formatDate(new Date(), "EEEE, dd 'de' MMMM yyyy")}
              </p>
              <p>Dados reais do seu workspace</p>
            </div>
            <button
              onClick={() => setEditorOpen(true)}
              className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 text-white/50 hover:text-white/80 hover:border-white/[0.14] hover:bg-white/[0.06] transition-all"
              title="Personalizar layout"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
          {FILTERS.map(filter => {
            const Icon = filter.icon
            const active = activeFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'border-primary/35 bg-primary/15 text-primary'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/35 hover:bg-white/[0.06] hover:text-white/65'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {filter.label}
              </button>
            )
          })}
        </motion.div>

        {/* Full-width widgets */}
        {fullWidthList.map(w => (
          <motion.div key={w.id} variants={fadeUp}>
            <WidgetNode id={w.id} />
          </motion.div>
        ))}

        {/* Grid widgets */}
        {gridList.length > 0 && (
          <motion.div variants={fadeUp} className="grid grid-cols-12 gap-5">
            {gridList.map(w => {
              const colSpan   = (w.size ? SIZE_COL[w.size] : null) ?? WIDGET_COL[w.id] ?? 'col-span-12 lg:col-span-4'
              const heightCls = w.height ? HEIGHT_CLASS[w.height] : undefined
              return (
                <div
                  key={w.id}
                  className={cn(
                    colSpan,
                    heightCls,
                    heightCls && 'flex flex-col [&>*]:flex-1 [&>*]:min-h-0',
                  )}
                >
                  <WidgetNode id={w.id} />
                </div>
              )
            })}
          </motion.div>
        )}

      </motion.div>

      <LayoutEditor
        userId={userId}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
      />
    </>
  )
}
