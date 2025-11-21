import { ILesson } from "./lesson"

export interface ISchedule extends Array<ILesson> {
  toIcalSchedule(): string
}
