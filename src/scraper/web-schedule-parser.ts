import { HTMLElement, parse } from 'node-html-parser'
import { ILesson, Lesson } from '#types/lesson'
import { Result } from '#types/result'
import { constructDate } from '#tools/construct-date'

const LESSON_SELECTOR = 'body > div > div > div > div > div'

const timeRegex = /(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/g
const dateRegex = /([0-2]\d|3[01])\.(0[1-9]|1[012])\.(20\d\d)/g

/**
 * Lesson HTML block
<div style="...">
  <span class="time_para">
    <b>08:30-12:55 </b>
    <i>01.10.2025</i>
  </span>
  <div style="color:#1c5bdd">Клинические практические занятия: <i>Офтальмология</i></div>
  <!---->
  <div>
    <b>Уч. ауд. № &nbsp;Институт семейной медицины и внутренних болезней</b>,
    <br>
  </div>
</div>

<div style="">
  <span class="time_para">
    <b>14:50-16:30 </b>
    <i>14.10.2025</i>
  </span>
  <div style="color:#1c5bdd">Лекция: <i>Внутренние болезни, эндокринология</i></div>
  <!---->
  <div>
    <b>Уч. ауд. № &nbsp;232А,Морфологический корпус Сибиряковцев,  д.2 к.3</b>,
    <br>
  </div>
</div>
 */

export class WebScheduleParser {
  parseWebSchedule(htmlSchedule: string[]): ILesson[] {
    const lessonsHtmlContainers = htmlSchedule.flatMap((h) =>
      this.parseLessonsHtmlContainers(h)
    )
    const lessons = lessonsHtmlContainers
      .map((lessonContainer) => this.constructLesson(lessonContainer))
      .filter((lessonResult) => lessonResult.ok)
      .map((LessonResult) => LessonResult.value)

    return lessons
  }

  private parseLessonsHtmlContainers(htmlSchedule: string): HTMLElement[] {
    const parsedHtmlSchedule = parse(htmlSchedule)
    const lessonsHtmlContainers =
      parsedHtmlSchedule.querySelectorAll(LESSON_SELECTOR)
    return lessonsHtmlContainers
  }

  /**
   * aggregate all others parsing methods to provide results to Lesson constructor
   */
  private constructLesson(lessonHtml: HTMLElement): Result<ILesson, string> {
    const timeResult = this.parseTime(lessonHtml)
    const dateResult = this.parseDate(lessonHtml)
    const titleAndTypeResult = this.parseTitleAndTypeStr(lessonHtml)
    const locationResult = this.parseLocation(lessonHtml)

    if (
      !timeResult.ok ||
      !dateResult.ok ||
      !titleAndTypeResult.ok ||
      !locationResult.ok
    ) {
      return { ok: false, error: 'Cannot parse lesson data from HTML' }
    }

    const { startTime, endTime } = timeResult.value
    const date = dateResult.value
    const { title, typeStr } = titleAndTypeResult.value
    const location = locationResult.value

    const startDateTime = constructDate({ ...date, ...startTime })
    const endDateTime = constructDate({ ...date, ...endTime })
    const isOnline = this.isLessonOnline(location)

    const lesson = new Lesson(
      startDateTime,
      endDateTime,
      title,
      location,
      isOnline
    )
    lesson.setTypeFromHtmlStr(typeStr)

    return { ok: true, value: lesson }
  }

  /**
   * Extract time of the beginning and the end
   * from Lesson HTML block
   * @param lessonHtml HTML block of a lesson
   * @returns Result object, if ok - start and end time
   * in oject format: hour and minute
   */
  private parseTime(lessonHtml: HTMLElement): Result<
    {
      startTime: { h: number; min: number }
      endTime: { h: number; min: number }
    },
    string
  > {
    const lessonText = lessonHtml.innerText
    if (lessonText === '') {
      return { ok: false, error: 'Cannot extract lesson time from HTML' }
    }

    const [startTime, endTime] = Array.from(lessonText.matchAll(timeRegex)).map(
      (t) => {
        if (!t[1] || !t[2]) {
          return false
        }
        return { h: Number(t[1]), min: Number(t[2]) }
      }
    )

    if (!startTime || !endTime) {
      return { ok: false, error: 'Invalid time format' }
    }
    return {
      ok: true,
      value: { startTime, endTime },
    }
  }

  /**
   * Extract date info from lesson HTML block
   * @param lessonHtml HTML block of a lesson
   * @returns Result, if ok - Object containing
   * day number, monthIndex (starts from 0 - January) and year
   */
  private parseDate(lessonHtml: HTMLElement): Result<
    {
      day: number
      monthIndex: number
      year: number
    },
    string
  > {
    const lessonText = lessonHtml.innerText
    if (lessonText === '') {
      return { ok: false, error: 'Cannot extract lesson date from HTML' }
    }

    const date = Array.from(lessonText.matchAll(dateRegex))[0]
    if (!date?.[1] || !date[2] || !date[3]) {
      return { ok: false, error: 'Invalid time format' }
    }

    const day = Number(date[1])
    const monthIndex = Number(date[2]) - 1 // month: 1-12 so to get monthIndex -1
    const year = Number(date[3])

    return {
      ok: true,
      value: { day, monthIndex, year },
    }
  }

  /**
   * Parses the lesson title and type string from the provided lesson HTML element.
   *
   * Expects the lesson header to be in the format "Type: Title" as the text content
   * of the fourth child node of the given HTMLElement. The method splits the header
   * by the colon, trims, and lowercases both parts.
   *
   * @param lessonHtml - The HTMLElement containing the lesson information.
   * @returns A Result object containing the parsed title and type string if successful,
   *          or an error message if parsing fails.
   */
  private parseTitleAndTypeStr(
    lessonHtml: HTMLElement
  ): Result<{ title: string; typeStr: string }, string> {
    const lessonHeader = lessonHtml.childNodes[3]?.innerText
    if (!lessonHeader) {
      return { ok: false, error: 'Lesson header is empty' }
    }
    const [lessonTypeStr, lessonTitle] = lessonHeader
      .split(':')
      .map((elem) => elem.trim().toLowerCase())

    if (!lessonTypeStr || !lessonTitle) {
      return {
        ok: false,
        error: 'Cannot parse lesson title and type form HTML',
      }
    }
    return { ok: true, value: { title: lessonTitle, typeStr: lessonTypeStr } }
  }

  /**
   * Parses the lesson location text from a lesson HTML element and returns a Result.
   *
   * Extracts the location from lessonHtml and returns the formatted location string on success.
   *
   * @param lessonHtml - The HTMLElement containing the lesson information.
   * @returns A Result object containing the parsed location string if successful,
   *          or an error message if parsing fails.
   */
  private parseLocation(lessonHtml: HTMLElement): Result<string, string> {
    const location = lessonHtml.childNodes[6]?.innerText.trim()
    if (!location) {
      return { ok: false, error: 'Cannot parse lesson location' }
    }
    const locationFormatted = location.replace('Уч. ауд. № &nbsp;', 'Ауд. №')

    return { ok: true, value: locationFormatted }
  }

  /**
   * Checks is lesson Online from location
   * @param lessonLocation lesson location string
   * @returns boolean
   */
  private isLessonOnline(lessonLocation: string): boolean {
    return lessonLocation.includes('Moodle')
  }
}
