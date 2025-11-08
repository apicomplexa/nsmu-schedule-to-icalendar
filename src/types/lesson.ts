import { randomUUID } from 'crypto'

export enum LessonType {
  practice = 'Practice',
  sem = 'Seminar',
  lection = 'Lection',
  lab = 'Laboratory work',
  clin = 'Clinical Practice',
  unknown = 'Unknown',
}

export interface ILesson {
  startTime: Date
  endTime: Date
  title: string
  location: string
  lessonType: LessonType
  isOnline: boolean
}

class MapWithDefaultValue<Index, Value> extends Map<Index, Value> {
  defaultValue: Value
  constructor(
    iterable: Iterable<readonly [Index, Value]>,
    defaultValue: Value
  ) {
    super(iterable)
    this.defaultValue = defaultValue
  }
  get(key: Index): Value {
    return super.get(key) ?? this.defaultValue
  }
}

const LessonTypeMap = new MapWithDefaultValue(
  [
    ['лекция', LessonType.lection],
    ['практические занятия', LessonType.practice],
    ['лабораторное занятие', LessonType.lab],
    ['семинар', LessonType.sem],
    ['клинические практические занятия', LessonType.clin],
  ],
  LessonType.unknown
)

const LessonsTypeLocalIcon = new MapWithDefaultValue(
  [
    [LessonType.practice, '✏️'],
    [LessonType.sem, '✏️'],
    [LessonType.lab, '✏️'],
    [LessonType.clin, '✏️'],
    [LessonType.unknown, '❔'],
    [LessonType.lection, '📝'],
  ],
  '❔'
)

const LessonsTypeLocalRu = new MapWithDefaultValue(
  [
    [LessonType.practice, 'Приктическое занятие'],
    [LessonType.sem, 'Семинар'],
    [LessonType.lab, 'Лабораторное занятие'],
    [LessonType.clin, 'Клиническая Практика'],
    [LessonType.unknown, 'Неизвестный тип'],
    [LessonType.lection, 'Лекция'],
  ],
  'Неизвестный тип'
)

// Helper function to format dates to iCalendar format
function formatDate(date: Date) {
  return date.toISOString().replaceAll(/-|:|(\.\d{3})/g, '')
}

/**
 * Represents a lesson with its details such as time, title, location, and type.
 *
 * @implements {ILesson}
 *
 * @property {Date} startTime - The start time of the lesson.
 * @property {Date} endTime - The end time of the lesson.
 * @property {string} title - The title or subject of the lesson.
 * @property {string} location - The location of the lesson.
 * @property {boolean} isOnline - Indicates if the lesson is held online.
 * @property {LessonType} lessonType - The type of the lesson (e.g., lecture, seminar).
 *
 * @method get lessonType - Gets the type of the lesson.
 * @method setTypeFromHtmlStr - Sets the lesson type based on a string from HTML.
 * @param {string} typeStr - The string representing the lesson type.
 */
export class Lesson implements ILesson {
  private _lessonType: LessonType

  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly title: string,
    public readonly location: string,
    public readonly isOnline: boolean,
    lessonType: LessonType = LessonType.unknown
  ) {
    this._lessonType = lessonType
  }

  get lessonType() {
    return this._lessonType
  }

  public setTypeFromHtmlStr(typeStr: string) {
    this._lessonType = LessonTypeMap.get(typeStr.trim().toLowerCase())
  }

  public toJSON(): ILesson {
    const lesson: ILesson = {
      startTime: this.startTime,
      endTime: this.endTime,
      title: this.title,
      location: this.location,
      isOnline: this.isOnline,
      lessonType: this.lessonType,
    }
    return lesson
  }

  public toICalEvent(): string {
    return `
    BEGIN:VEVENT 
    UID:${randomUUID()} 
    DTSTAMP:${formatDate(new Date())} 
    DTSTART:${formatDate(this.startTime)} 
    DTEND:${formatDate(this.endTime)} 
    SUMMARY:${LessonsTypeLocalIcon.get(this.lessonType)}${this.title} (${LessonsTypeLocalRu.get(this.lessonType)}) 
    LOCATION:${this.location} 
    END:VEVENT
    `
  }
}
