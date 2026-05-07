'use client'

import { motion } from 'framer-motion'
import { DashboardMetrics } from '@/components/dashboard/metrics'
import { BugTrendChart } from '@/components/dashboard/bug-trend-chart'
import { SprintProgress } from '@/components/dashboard/sprint-progress'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ActiveProjects } from '@/components/dashboard/active-projects'
import { TeamPresence } from '@/components/dashboard/team-presence'
import { CriticalBugs } from '@/components/dashboard/critical-bugs'
import { SentinelAI } from '@/components/dashboard/sentinel-ai'
import { TodayDailyWidget } from '@/components/dashboard/today-daily-widget'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'
import { QATodayWidget } from '@/components/dashboard/qa-today-widget'
import { useAuthStore } from '@/store/auth'
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

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.name.split(' ')[0] ?? ''

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome header */}
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
        <div className="text-right text-xs text-white/30 shrink-0 hidden sm:block">
          <p className="font-medium text-white/50">
            {formatDate(new Date(), "EEEE, dd 'de' MMMM yyyy")}
          </p>
          <p>Sprint 14 · 5 dias restantes</p>
        </div>
      </motion.div>

      {/* Today's Daily — top priority */}
      <motion.div variants={fadeUp}>
        <TodayDailyWidget />
      </motion.div>

      {/* Metric cards */}
      <motion.div variants={fadeUp}>
        <DashboardMetrics />
      </motion.div>

      {/* Sentinel AI */}
      <motion.div variants={fadeUp}>
        <SentinelAI />
      </motion.div>

      {/* Main grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <BugTrendChart />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <SprintProgress />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <ActiveProjects />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <TeamPresence />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <CriticalBugs />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <CalendarWidget />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <QATodayWidget />
        </div>
      </motion.div>
    </motion.div>
  )
}
