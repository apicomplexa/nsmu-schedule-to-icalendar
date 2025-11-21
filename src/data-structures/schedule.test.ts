import { Schedule } from './schedule'
import { Lesson } from './lesson'

jest.mock('crypto')

import { randomUUID } from 'crypto'

describe('Schedule', () => {
  const lessons = [
    new Lesson(
      new Date('2024-01-01T09:00:00'),
      new Date('2024-01-01T10:00:00'),
      'Mathematics',
      'Main Building',
      false
    ),
    new Lesson(
      new Date('2024-01-01T11:00:00'),
      new Date('2024-01-01T12:00:00'),
      'Anatomy',
      'Hospital',
      false
    ),
  ]

  /**  
BEGIN:VCALENDAR
VERSION:2.0
PRODID: NSMU calendar
EN CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:mocked-uuid-1
DTSTAMP:20251115T073620Z
DTSTART:20240101T060000Z
DTEND:20240101T070000Z
SUMMARY:❔Mathematics (Неизвестный тип)
LOCATION:Main Building
END:VEVENT
BEGIN:VEVENT
UID:mocked-uuid-2
DTSTAMP:20251115T073620Z
DTSTART:20240101T080000Z
DTEND:20240101T090000Z
SUMMARY:❔Anatomy (Неизвестный тип)
LOCATION:Hospital
END:VEVENT
END:VCALENDAR
*/
  describe('toIcalSchedule', () => {
    it('should return icalendar schedule from array of lessons', () => {
      ;(randomUUID as jest.Mock).mockReturnValueOnce('mocked-uuid-1')
      ;(randomUUID as jest.Mock).mockReturnValueOnce('mocked-uuid-2')

      const schedule = new Schedule(...lessons)
      const icalendarSchedule = schedule.toIcalSchedule()
      expect(icalendarSchedule).toMatch(
        /BEGIN:VCALENDAR\nVERSION:2.0\nPRODID: NSMU calendar\nEN CALSCALE:GREGORIAN/
      )
      expect(icalendarSchedule).toContain('END:VCALENDAR')
      expect(icalendarSchedule).toMatch(
        /BEGIN:VEVENT\nUID:mocked-uuid-1\nDTSTAMP:\d{8}T\d{6}Z\nDTSTART:20240101T060000Z\nDTEND:20240101T070000Z\nSUMMARY:❔Mathematics \(Неизвестный тип\)\nLOCATION:Main Building\nEND:VEVENT/
      )
      expect(icalendarSchedule).toMatch(
        /BEGIN:VEVENT\nUID:mocked-uuid-2\nDTSTAMP:\d{8}T\d{6}Z\nDTSTART:20240101T080000Z\nDTEND:20240101T090000Z\nSUMMARY:❔Anatomy \(Неизвестный тип\)\nLOCATION:Hospital\nEND:VEVENT/
      )
    })
  })
})
