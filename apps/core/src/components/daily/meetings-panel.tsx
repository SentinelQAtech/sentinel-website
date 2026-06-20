'use client'

import { Clock, Trash2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGION_CONFIG, type DailyMeeting } from '@/store/daily'
import { useDailyMeetings, useDeleteDailyMeeting } from '@/hooks/useDaily'

function upcomingClass(time: string) {
  const [h, m] = time.split(':').map(Number)
  const now    = new Date()
  const diff   = h * 60 + m - (now.getHours() * 60 + now.getMinutes())
  if (diff >= 0 && diff <= 30)  return 'border-amber-500/30 bg-amber-500/[0.04]'
  if (diff < 0)                 return 'opacity-40'
  return ''
}

function isNext(meeting: DailyMeeting, all: DailyMeeting[]) {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [h, m] = meeting.time.split(':').map(Number)
  const meetMin = h * 60 + m
  if (meetMin < nowMin) return false
  return all.every(other => {
    const [oh, om] = other.time.split(':').map(Number)
    const otherMin = oh * 60 + om
    return otherMin >= nowMin ? meetMin <= otherMin : true
  })
}

interface RegionGroupProps {
  region:   string
  meetings: DailyMeeting[]
  all:      DailyMeeting[]
  onRemove: (id: string) => void
}

function RegionGroup({ region, meetings, all, onRemove }: RegionGroupProps) {
  const cfg = REGION_CONFIG[region] ?? { flag: '🌐', color: '#6366f1' }

  return (
    <div>
      {/* Region header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base leading-none">{cfg.flag}</span>
        <span className="text-xs font-semibold text-white/60">{region}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
          style={{ color: cfg.color, borderColor: cfg.color + '40', backgroundColor: cfg.color + '15' }}
        >
          {meetings.length}
        </span>
      </div>

      {/* Meeting times */}
      <div className="space-y-1 pl-2">
        {meetings.map(m => {
          const next = isNext(m, all)
          return (
            <div
              key={m.id}
              className={cn(
                'group flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-transparent',
                'hover:bg-white/[0.04] transition-colors duration-150',
                upcomingClass(m.time)
              )}
            >
              {/* Next indicator */}
              {next && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              )}
              {!next && <span className="w-1.5 h-1.5 shrink-0" />}

              <Clock className="w-3 h-3 text-white/30 shrink-0" />
              <span className="text-sm font-mono font-semibold text-white/80">{m.time}</span>

              {m.title && (
                <span className="flex-1 text-xs text-white/45 truncate">{m.title}</span>
              )}
              {!m.title && <span className="flex-1" />}

              {next && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  PRÓXIMA
                </span>
              )}

              <button
                onClick={() => onRemove(m.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/20 hover:text-red-400 transition-all duration-150"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MeetingsPanel({ date }: { date: string }) {
  const { data: meetings = [] } = useDailyMeetings(date)
  const deleteMeeting = useDeleteDailyMeeting()

  const regions = Object.keys(REGION_CONFIG).filter(r =>
    meetings.some(m => m.region === r)
  )
  const otherRegions = [...new Set(meetings.map(m => m.region))].filter(r => !regions.includes(r))
  const allRegions = [...regions, ...otherRegions]

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Video className="w-8 h-8 text-white/15 mb-2" />
        <p className="text-sm text-white/30">Nenhuma reunião nesta data</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {allRegions.map(region => {
        const regionMeetings = meetings.filter(m => m.region === region)
        if (regionMeetings.length === 0) return null
        return (
          <RegionGroup
            key={region}
            region={region}
            meetings={regionMeetings}
            all={meetings}
            onRemove={(id) => deleteMeeting.mutate(id)}
          />
        )
      })}
    </div>
  )
}
