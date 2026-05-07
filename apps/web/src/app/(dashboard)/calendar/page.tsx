import { CalendarDays } from 'lucide-react'
import { CalendarClient } from '@/components/calendar/calendar-client'

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-5" style={{ height: 'calc(100vh - 56px - 48px)' }}>
      {/* Page header */}
      <div className="shrink-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-white">Calendário</h1>
        </div>
        <p className="text-sm text-white/40 mt-0.5">Gerencie eventos, meetings e deadlines.</p>
      </div>

      {/* Calendar takes remaining height */}
      <div className="flex-1 min-h-0">
        <CalendarClient />
      </div>
    </div>
  )
}
