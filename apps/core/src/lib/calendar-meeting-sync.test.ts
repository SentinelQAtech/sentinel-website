import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getCalendarMeetingIdentity,
  selectLegacyMeetingsForMigration,
} from './calendar-meeting-sync'

test('normalizes meeting identity by title, date and time', () => {
  assert.equal(
    getCalendarMeetingIdentity({ title: '  Reuniao   de QA ', date: '2026-06-20', time: '09:30' }),
    getCalendarMeetingIdentity({ title: 'reuniao de qa', date: '2026-06-20', time: '09:30' }),
  )
})

test('selects only future local meetings that do not already exist in the API', () => {
  const selected = selectLegacyMeetingsForMigration(
    [
      { id: 'old', title: 'Old', date: '2026-06-19', startTime: '09:00', endTime: '10:00', type: 'meeting' },
      { id: 'duplicate', title: ' Daily QA ', date: '2026-06-20', startTime: '09:00', endTime: '09:30', type: 'meeting' },
      { id: 'future', title: 'Planning', date: '2026-06-21', startTime: '10:00', endTime: '11:00', type: 'meeting' },
      { id: 'deadline', title: 'Release', date: '2026-06-21', startTime: '12:00', endTime: '12:30', type: 'deadline' },
    ],
    [{ id: 'api-1', title: 'daily qa', date: '2026-06-20', time: '09:00', region: '' }],
    '2026-06-20',
  )

  assert.deepEqual(selected.map(item => item.id), ['future'])
})
