'use client'

import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useUser } from '@/hooks/useAuth'
import { useCreateDailyMeeting, useDailyMeetings } from '@/hooks/useDaily'
import { useCalendarStore } from '@/store/calendar'
import {
  calendarEventToDailyMeeting,
  CALENDAR_MEETING_MIGRATION_OWNER_KEY,
  getCalendarMeetingMigrationKey,
  selectLegacyMeetingsForMigration,
} from '@/lib/calendar-meeting-sync'
import { getApiErrorMessage } from '@/lib/api-error'

function getLocalISODate(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function CalendarMeetingMigration() {
  const user = useUser()
  const events = useCalendarStore(state => state.events)
  const meetingsQuery = useDailyMeetings()
  const createMeeting = useCreateDailyMeeting()
  const migrationStarted = useRef(false)

  useEffect(() => {
    if (!user?.id || !meetingsQuery.isSuccess || migrationStarted.current) return

    const migrationKey = getCalendarMeetingMigrationKey(user.id)
    if (localStorage.getItem(migrationKey) === 'complete') return
    const migrationOwner = localStorage.getItem(CALENDAR_MEETING_MIGRATION_OWNER_KEY)
    if (migrationOwner && migrationOwner !== user.id) return
    if (!migrationOwner) {
      localStorage.setItem(CALENDAR_MEETING_MIGRATION_OWNER_KEY, user.id)
    }
    migrationStarted.current = true

    const migrate = async () => {
      const eligible = selectLegacyMeetingsForMigration(
        events,
        meetingsQuery.data ?? [],
        getLocalISODate(),
      )

      try {
        for (const event of eligible) {
          await createMeeting.mutateAsync(calendarEventToDailyMeeting(event))
        }
        localStorage.setItem(migrationKey, 'complete')
        if (eligible.length > 0) {
          toast.success(`${eligible.length} reuniao(oes) antiga(s) migrada(s) para a API.`)
        }
      } catch (error) {
        console.error('Falha ao migrar reunioes legadas do Calendar.', error)
        toast.error(getApiErrorMessage(error, 'Falha ao migrar reunioes antigas. A migracao continuara pendente.'))
      }
    }

    void migrate()
  }, [createMeeting, events, meetingsQuery.data, meetingsQuery.isSuccess, user?.id])

  return null
}
