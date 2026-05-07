'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { DashboardMetrics }   from '@/components/dashboard/metrics'
import { BugTrendChart }      from '@/components/dashboard/bug-trend-chart'
import { SprintProgress }     from '@/components/dashboard/sprint-progress'
import { RecentActivity }     from '@/components/dashboard/recent-activity'
import { ActiveProjects }     from '@/components/dashboard/active-projects'
import { TeamPresence }       from '@/components/dashboard/team-presence'
import { CriticalBugs }       from '@/components/dashboard/critical-bugs'
import { SentinelAI }         from '@/components/dashboard/sentinel-ai'
import { TodayDailyWidget }   from '@/components/dashboard/today-daily-widget'
import { CalendarWidget }     from '@/components/dashboard/calendar-widget'
import { QATodayWidget }      from '@/components/dashboard/qa-today-widget'
import { LayoutEditor }       from '@/components/dashboard/layout-editor'
import { useAuthStore }           from '@/store/auth'
import { useDashboardLayoutStore } from '@/store/dashboard-layout'
import { formatDate } from '@/lib/utils'

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

// Maps widget id → the component that renders it (with its grid col-span)
const WIDGET_COMPONENTS: Record<string, { node: React.ReactNode; colSpan: string }> = {
  'daily':           { node: <TodayDailyWidget />,  colSpan: 'col-span-12' },
  'metrics':         { node: <DashboardMetrics />,   colSpan: 'col-span-12' },
  'sentinel-ai':     { node: <SentinelAI />,         colSpan: 'col-span-12' },
  'bug-trend':       { node: <BugTrendChart />,      colSpan: 'col-span-12 lg:col-span-8' },
  'sprint':          { node: <SprintProgress />,     colSpan: 'col-span-12 lg:col-span-4' },
  'active-projects': { node: <ActiveProjects />,     colSpan: 'col-span-12 lg:col-span-7' },
  'team-presence':   { node: <TeamPresence />,       colSpan: 'col-span-12 lg:col-span-5' },
  'critical-bugs':   { node: <CriticalBugs />,       colSpan: 'col-span-12 lg:col-span-3' },
  'recent-activity': { node: <RecentActivity />,     colSpan: 'col-span-12 lg:col-span-3' },
  'calendar':        { node: <CalendarWidget />,     colSpan: 'col-span-12 lg:col-span-3' },
  'qa-today':        { node: <QATodayWidget />,      colSpan: 'col-span-12 lg:col-span-3' },
}

// Full-width widgets are rendered outside the grid; grid widgets share rows
const FULL_WIDTH = new Set(['daily', 'metrics', 'sentinel-ai'])

export default function DashboardPage() {
  const user      = useAuthStore(s => s.user)
  const userId    = user?.id ?? 'guest'
  const firstName = user?.name.split(' ')[0] ?? ''

  const { getLayout } = useDashboardLayoutStore()
  const layout = getLayout(userId)

  const [editorOpen, setEditorOpen] = useState(false)

  // Split visible widgets into full-width and grid groups
  const visible       = layout.filter(w => w.visible)
  const fullWidthList = visible.filter(w => FULL_WIDTH.has(w.id))
  const gridList      = visible.filter(w => !FULL_WIDTH.has(w.id))

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Welcome header — always fixed */}
        <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting()},{' '}
              <span className="gradient-text">{firstName}</span>{' '}
              <span>👋</span>
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
              <p>Sprint 14 · 5 dias restantes</p>
            </div>
            <button
              onClick={() => setEditorOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/50 hover:text-white/80 hover:border-white/[0.14] hover:bg-white/[0.06] transition-all"
              title="Personalizar layout"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Personalizar</span>
            </button>
          </div>
        </motion.div>

        {/* Full-width widgets (daily, metrics, sentinel-ai) in user-defined order */}
        {fullWidthList.map(w => (
          <motion.div key={w.id} variants={fadeUp}>
            {WIDGET_COMPONENTS[w.id]?.node}
          </motion.div>
        ))}

        {/* Grid widgets */}
        {gridList.length > 0 && (
          <motion.div variants={fadeUp} className="grid grid-cols-12 gap-5">
            {gridList.map(w => {
              const cfg = WIDGET_COMPONENTS[w.id]
              if (!cfg) return null
              return (
                <div key={w.id} className={cfg.colSpan}>
                  {cfg.node}
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
