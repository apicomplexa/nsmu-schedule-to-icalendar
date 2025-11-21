export enum LessonType {
  practice = 'Practice',
  sem = 'Seminar',
  lection = 'Lection',
  lab = 'Laboratory work',
  clin = 'Clinical Practice',
  unknown = 'Unknown',
}

export interface LessonData {
  startTime: Date
  endTime: Date
  title: string
  location: string
  lessonType: LessonType
  isOnline: boolean
}

export interface ILesson extends LessonData {
  toICalEvent(): string
  toJSON(): LessonData
}
