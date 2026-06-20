import type { DailyMeeting } from '@/store/daily'
import type { CalendarEvent, EventRegion } from '@/store/calendar'
import type { CreateDailyMeetingInput } from '@/hooks/useDaily'

type MeetingIdentityInput = {
  title?: string | null
  date?: string
  time?: string
}

const REGION_TO_API: Record<EventRegion, string> = {
  india: 'India',
  usa: 'EUA',
  brazil: 'Brasil',
  ukraine: 'Ucrania',
}

const API_TO_REGION: Record<string, EventRegion> = {
  india: 'india',
  indiaa: 'india',
  eua: 'usa',
  usa: 'usa',
  brasil: 'brazil',
  brazil: 'brazil',
  ucrania: 'ukraine',
  ukraine: 'ukraine',
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export function getCalendarMeetingIdentity(meeting: MeetingIdentityInput): string {
  return [
    normalizeText(meeting.title ?? ''),
    meeting.date?.slice(0, 10) ?? '',
    meeting.time ?? '',
  ].join('|')
}

export function selectLegacyMeetingsForMigration(
  localEvents: CalendarEvent[],
  apiMeetings: DailyMeeting[],
  today: string,
): CalendarEvent[] {
  const identities = new Set(apiMeetings.map(getCalendarMeetingIdentity))
  const selected: CalendarEvent[] = []

  for (const event of localEvents) {
    if (event.type !== 'meeting' || event.date < today) continue
    const identity = getCalendarMeetingIdentity({
      title: event.title,
      date: event.date,
      time: event.startTime,
    })
    if (identities.has(identity)) continue
    identities.add(identity)
    selected.push(event)
  }

  return selected
}

export function getCalendarMeetingMigrationKey(userId: string): string {
  return `sentinel-core-calendar-meetings-api-v1:${encodeURIComponent(userId)}`
}

export const CALENDAR_MEETING_MIGRATION_OWNER_KEY = 'sentinel-core-calendar-meetings-api-v1-owner'

export function calendarEventToDailyMeeting(event: CalendarEvent): CreateDailyMeetingInput {
  return {
    date: event.date,
    time: event.startTime,
    title: event.title,
    region: event.region ? REGION_TO_API[event.region] : undefined,
    participants: event.participants?.join(', '),
    notes: event.description,
  }
}

export function dailyMeetingToCalendarEvent(meeting: DailyMeeting): CalendarEvent {
  const regionKey = normalizeText(meeting.region ?? '')
  return {
    id: meeting.id,
    title: meeting.title || 'Reuniao',
    date: meeting.date || '',
    startTime: meeting.time,
    endTime: meeting.time,
    type: 'meeting',
    region: API_TO_REGION[regionKey],
    participants: meeting.participants
      ? meeting.participants.split(',').map(value => value.trim()).filter(Boolean)
      : undefined,
    description: meeting.notes,
  }
}
