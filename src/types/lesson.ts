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

class LessonTypeMapClass extends Map<string, LessonType> {
  get(key: string): LessonType {
    return super.get(key) ?? LessonType.unknown
  }
}

const LessonTypeMap = new LessonTypeMapClass([
  ['лекция', LessonType.lection],
  ['практические занятия', LessonType.practice],
  ['лабораторное занятие', LessonType.lab],
  ['семинар', LessonType.sem],
  ['клинические практические занятия', LessonType.clin],
])

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
}
