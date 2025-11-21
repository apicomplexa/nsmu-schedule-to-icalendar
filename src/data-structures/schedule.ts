import { ILesson } from "#/types/lesson"
import { ISchedule } from "#/types/schedule"

export class Schedule extends Array<ILesson> implements ISchedule {
  public toIcalSchedule() {
    const icalEvents = this.map((l) => l.toICalEvent())
    return `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID: NSMU calendar
    EN CALSCALE:GREGORIAN
    ${icalEvents.join('\n')}
    END:VCALENDAR`
      .trim()
      .replaceAll(/(^ *)|( *$)/gm, '')
      .replaceAll(`\n\r`, '\n')
  }
}
