import { Lesson, LessonType } from './lesson'

describe('Lesson', () => {
  const baseProps = {
    startTime: new Date('2024-01-01T09:00:00'),
    endTime: new Date('2024-01-01T10:00:00'),
    title: 'Mathematics',
    auditory: '101',
    location: 'Main Building',
    isOnline: false,
  }

  it('should create a Lesson with default lessonType as unknown', () => {
    const lesson = new Lesson(
      baseProps.startTime,
      baseProps.endTime,
      baseProps.title,
      baseProps.auditory,
      baseProps.location,
      baseProps.isOnline
    )
    expect(lesson.lessonType).toBe(LessonType.unknown)
    expect(lesson.startTime).toEqual(baseProps.startTime)
    expect(lesson.endTime).toEqual(baseProps.endTime)
    expect(lesson.title).toBe(baseProps.title)
    expect(lesson.auditory).toBe(baseProps.auditory)
    expect(lesson.location).toBe(baseProps.location)
    expect(lesson.isOnline).toBe(baseProps.isOnline)
  })

  it('should create a Lesson with a specified lessonType', () => {
    const lesson = new Lesson(
      baseProps.startTime,
      baseProps.endTime,
      baseProps.title,
      baseProps.auditory,
      baseProps.location,
      baseProps.isOnline,
      LessonType.lab
    )
    expect(lesson.lessonType).toBe(LessonType.lab)
  })

  it('should set lessonType from HTML string (known type)', () => {
    const lesson = new Lesson(
      baseProps.startTime,
      baseProps.endTime,
      baseProps.title,
      baseProps.auditory,
      baseProps.location,
      baseProps.isOnline
    )
    lesson.setTypeFromHtmlStr('лекция')
    expect(lesson.lessonType).toBe(LessonType.lection)

    lesson.setTypeFromHtmlStr('практические занятия')
    expect(lesson.lessonType).toBe(LessonType.practice)

    lesson.setTypeFromHtmlStr('лабораторное занятие')
    expect(lesson.lessonType).toBe(LessonType.lab)

    lesson.setTypeFromHtmlStr('семинар')
    expect(lesson.lessonType).toBe(LessonType.sem)

    lesson.setTypeFromHtmlStr('клинические практические занятия')
    expect(lesson.lessonType).toBe(LessonType.clin)
  })

  it('should set lessonType to unknown for unknown HTML string', () => {
    const lesson = new Lesson(
      baseProps.startTime,
      baseProps.endTime,
      baseProps.title,
      baseProps.auditory,
      baseProps.location,
      baseProps.isOnline
    )
    lesson.setTypeFromHtmlStr('неизвестный тип')
    expect(lesson.lessonType).toBe(LessonType.unknown)
  })

  it('should trim and lowercase the input string in setTypeFromHtmlStr', () => {
    const lesson = new Lesson(
      baseProps.startTime,
      baseProps.endTime,
      baseProps.title,
      baseProps.auditory,
      baseProps.location,
      baseProps.isOnline
    )
    lesson.setTypeFromHtmlStr('  ЛЕКЦИЯ  ')
    expect(lesson.lessonType).toBe(LessonType.lection)
  })
})
