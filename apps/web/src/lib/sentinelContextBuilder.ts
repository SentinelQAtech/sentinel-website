import type { DailyTask, DailyMeeting } from '@/store/daily'
import type { QAItem } from '@/store/qa-importer'
import type { CalendarEvent } from '@/store/calendar'

export interface SentinelContext {
  today: string
  daily: {
    tasks:    { client: string; title: string; type: string; priority: string; status: string; notes?: string }[]
    meetings: { region: string; time: string; title?: string }[]
    summary:  { total: number; done: number; blocked: number; critical: number }
  }
  qa: {
    total:    number
    pending:  number
    critical: number
    blocked:  number
    items:    { issueKey: string; title: string; priority: string; category: string; client: string; sentToDaily: boolean }[]
  }
  calendar: {
    todayEvents:    { title: string; startTime: string; endTime: string; type: string }[]
    upcomingEvents: { title: string; date: string; type: string }[]
  }
}

export function buildSentinelContext(
  tasks:    DailyTask[],
  meetings: DailyMeeting[],
  qaItems:  QAItem[],
  events:   CalendarEvent[],
): SentinelContext {
  const today = new Date().toISOString().split('T')[0]

  const todayEvents = events
    .filter(e => e.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const upcomingEvents = events
    .filter(e => e.date > today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  const pendingQA  = qaItems.filter(i => !i.sentToDaily && i.qaCategory !== 'Done')
  const criticalQA = qaItems.filter(i => i.priority === 'Critical' && i.qaCategory !== 'Done')
  const blockedQA  = qaItems.filter(i => i.qaCategory === 'Blocked')

  return {
    today,
    daily: {
      tasks: tasks.map(t => ({
        client:   t.client,
        title:    t.title,
        type:     t.type,
        priority: t.priority,
        status:   t.status,
        notes:    t.notes,
      })),
      meetings: meetings.map(m => ({
        region: m.region,
        time:   m.time,
        title:  m.title,
      })),
      summary: {
        total:    tasks.length,
        done:     tasks.filter(t => t.status === 'done').length,
        blocked:  tasks.filter(t => t.status === 'blocked').length,
        critical: tasks.filter(t => t.priority === 'Critical').length,
      },
    },
    qa: {
      total:    qaItems.length,
      pending:  pendingQA.length,
      critical: criticalQA.length,
      blocked:  blockedQA.length,
      items: qaItems.slice(0, 25).map(i => ({
        issueKey:    i.issueKey,
        title:       i.title,
        priority:    i.priority,
        category:    i.qaCategory,
        client:      i.client,
        sentToDaily: i.sentToDaily,
      })),
    },
    calendar: {
      todayEvents: todayEvents.map(e => ({
        title:     e.title,
        startTime: e.startTime,
        endTime:   e.endTime,
        type:      e.type,
      })),
      upcomingEvents: upcomingEvents.map(e => ({
        title: e.title,
        date:  e.date,
        type:  e.type,
      })),
    },
  }
}
