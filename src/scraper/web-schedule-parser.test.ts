import { parse } from 'node-html-parser'
import { WebScheduleParser } from './web-schedule-parser'

describe('WebScheduleParser (unit)', () => {
  let parser: WebScheduleParser

  const html = `<div style="">
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
    `

  beforeEach(() => {
    parser = new WebScheduleParser()
  })

  it('parses time (start and end) from lesson HTML', () => {
    const element = parse(html)
    const result = (parser as any).parseTime(element)
    expect(result.ok).toBe(true)
    expect(result.value.startTime).toEqual({ h: 14, min: 50 })
    expect(result.value.endTime).toEqual({ h: 16, min: 30 })
  })

  it('parses date from lesson HTML', () => {
    const element = parse(html)
    const result = (parser as any).parseDate(element)
    expect(result.ok).toBe(true)
    expect(result.value.day).toBe(14)
    expect(result.value.monthIndex).toBe(9) // October (10) index -> 9
    expect(result.value.year).toBe(2025)
  })

  it('parses title and type string from lesson HTML', () => {
    const element = parse(html)
    const result = (parser as any).parseTitleAndTypeStr(element)
    expect(result.ok).toBe(true)
    expect(result.value.typeStr).toBe('лекция')
    expect(result.value.title).toContain('внутренние болезни, эндокринология')
  })

  it('parses location from lesson HTML', () => {
    const element = parse(html)
    const result = (parser as any).parseLocation(element)
    expect(result.ok).toBe(true)
    // Ensure important parts of the location are present (replacement behavior may vary)
    expect(result.value).toContain('232А')
    expect(result.value).toContain('Морфологический корпус')
  })

  it('detects online lessons by location text', () => {
    expect((parser as any).isLessonOnline('Ауд. № 101')).toBe(false)
    expect((parser as any).isLessonOnline('Moodle — онлайн')).toBe(true)
  })

  it('parseWebSchedule uses constructLesson results and filters out failed parses', () => {
    // prepare two HTML strings that produce one matching container each
    const html1 = `<body><div><div><div><div><div>one</div></div></div></div></div></body>`
    const html2 = `<body><div><div><div><div><div>two</div></div></div></div></div></body>`

    const lesson1 = { mock: 'lesson1' } as any
    const lesson2 = { mock: 'lesson2' } as any

    const spy = jest
      .spyOn(parser as any, 'constructLesson')
      .mockImplementationOnce(() => ({ ok: false, error: 'bad' }))
      .mockImplementationOnce(() => ({ ok: true, value: lesson2 }))

    const result = parser.parseWebSchedule([html1, html2])
    expect(spy).toHaveBeenCalled()
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(lesson2)

    spy.mockRestore()
  })

  it('parseWebSchedule returns all lessons when constructLesson succeeds', () => {
    const htmlA = `<body><div><div><div><div><div>A</div></div></div></div></div></body>`
    const htmlB = `<body><div><div><div><div><div>B</div></div></div></div></div></body>`

    const lessonA = { id: 'A' } as any
    const lessonB = { id: 'B' } as any

    const spy = jest
      .spyOn(parser as any, 'constructLesson')
      .mockImplementationOnce(() => ({ ok: true, value: lessonA }))
      .mockImplementationOnce(() => ({ ok: true, value: lessonB }))

    const lessons = parser.parseWebSchedule([htmlA, htmlB])
    expect(lessons).toEqual([lessonA, lessonB])

    spy.mockRestore()
  })
})
