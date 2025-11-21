import { parse } from 'node-html-parser'
import { WebScheduleParser } from './web-schedule-parser'
import * as fs from 'fs'
import * as path from 'path'

describe('WebScheduleParser (unit)', () => {
  let parser: WebScheduleParser

  const oneLessonHtml = `<div class="isolated-lesson-div-wrapper">
  <div
    style="
      background-color: #ff7400;
      padding: 5px;
      height: 370px;
      max-height: 370px;
      word-wrap: break-word;
      border-radius: 10px;
      border: 1px solid #999;
    "
    class="isolated-lesson-div"
  >
    <span class="time_para">
      <b>13:00-14:40 </b><i>08.11.2025</i></span>
    <div style="color: #1c5bdd">Лекция: <i> Психиатрия</i></div>

    <!---->

    <div>
      <b>Уч. ауд. № &nbsp;2102, СГМУ Административный корпус</b>,
      <br>
      Пр. Троицкий, д. 51
    </div>
  </div></div>
  `
  const element = parse(oneLessonHtml).querySelector('.isolated-lesson-div')

  const weekHtml = fs.readFileSync(
    path.join(__dirname, 'week-example.html'),
    'utf8'
  )

  beforeEach(() => {
    parser = new WebScheduleParser()
  })

  describe('parseWebSchedule', () => {
    it('parse all lessons form all HTMLs and convert them to ILesson object', () => {
      const lessons = parser.parseWebSchedule([weekHtml])
      expect(lessons).toHaveLength(10)

      expect(lessons[0]?.startTime.toISOString()).toEqual(
        '2025-11-03T05:30:00.000Z'
      )
      expect(lessons[0]?.endTime.toISOString()).toEqual(
        '2025-11-03T09:55:00.000Z'
      )
      expect(lessons[0]?.lessonType).toBe('Clinical Practice')
      expect(lessons[0]?.title).toContain('онкология,лучевая терапия')
      expect(lessons[0]?.location).toContain(
        'Ауд. №Кафедра лучевой диагностики, лучевой терапии'
      )
      expect(lessons[0]?.isOnline).toBe(false)
    })
  })

  describe('parseLessonsHtmlContainers (private)', () => {
    it('parseLessonsHtmlContainers finds all lessons containers', () => {
      const lessons = (parser as any).parseLessonsHtmlContainers(weekHtml)
      expect(lessons).toHaveLength(10)
    })
  })

  describe('constructLesson (private)', () => {
    it('construct Lesson object from HTML', () => {
      const result = (parser as any).constructLesson(element)
      expect(result.ok).toBe(true)
      expect(result.value.startTime.toISOString()).toEqual(
        '2025-11-08T10:00:00.000Z'
      )
      expect(result.value.endTime.toISOString()).toEqual(
        '2025-11-08T11:40:00.000Z'
      )
      expect(result.value.lessonType).toBe('Lection')
      expect(result.value.title).toContain('психиатрия')
      expect(result.value.location).toContain('СГМУ Административный корпус')
      expect(result.value.isOnline).toBe(false)
    })
  })

  describe('parseTime (private)', () => {
    it('parses time (start and end) from lesson HTML', () => {
      const result = (parser as any).parseTime(element)
      expect(result.ok).toBe(true)
      expect(result.value.startTime).toEqual({ h: 13, min: 0 })
      expect(result.value.endTime).toEqual({ h: 14, min: 40 })
    })
  })

  describe('parseDate (private)', () => {
    it('parses date from lesson HTML', () => {
      const result = (parser as any).parseDate(element)
      expect(result.ok).toBe(true)
      expect(result.value.day).toBe(8)
      expect(result.value.monthIndex).toBe(10) // November (11) index -> 10
      expect(result.value.year).toBe(2025)
    })
  })

  describe('parseTitleAndTypeStr (private)', () => {
    it('parses title and type string from lesson HTML', () => {
      const result = (parser as any).parseTitleAndTypeStr(element)
      expect(result.ok).toBe(true)
      expect(result.value.typeStr).toBe('лекция')
      expect(result.value.title).toContain('психиатрия')
    })
  })

  describe('parseLocation (private)', () => {
    it('parses location from lesson HTML', () => {
      const result = (parser as any).parseLocation(element)
      expect(result.ok).toBe(true)
      // Ensure important parts of the location are present (replacement behavior may vary)
      expect(result.value).toContain('2102')
      expect(result.value).toContain('СГМУ Административный корпус')
    })
  })

  describe('isLessonOnline (private)', () => {
    it('detects online lessons by location text', () => {
      expect((parser as any).isLessonOnline('Ауд. № 101')).toBe(false)
      expect((parser as any).isLessonOnline('Moodle — онлайн')).toBe(true)
    })
  })
})
