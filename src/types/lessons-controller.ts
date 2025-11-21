import { Middleware } from '#T/middleware'

export interface ILessonsController {
  getLessons: Middleware
  getLections: Middleware
}
