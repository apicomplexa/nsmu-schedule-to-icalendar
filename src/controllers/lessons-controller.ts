import { Response } from 'express'
import { LessonRequest } from '#T/lesson-request'
import { GroupId } from '#T/repository'
import { ISchedule } from '#T/schedule'
import { LessonReq2GroupId } from '#/tools/lesson-request-to-group-id'

interface LessonProvider {
  getLessons(params: GroupId): Promise<ISchedule>
  getLections(params: GroupId): Promise<ISchedule>
}

abstract class LessonController {
  constructor(private readonly lessonsProvider: LessonProvider) {}

  private async absGetLessonsAsJson(
    getLessonsFunc: (params: GroupId) => Promise<ISchedule>,
    req: LessonRequest,
    res: Response,
    next: () => unknown
  ) {
    const groupId = LessonReq2GroupId(req)
    const schedule = await getLessonsFunc(groupId)
    const formedSchedule = this.prepareScheduleBeforeSending(schedule)
    this.sendResponse(formedSchedule, res, next)
  }

  protected abstract prepareScheduleBeforeSending(schedule: ISchedule): unknown
  protected abstract sendResponse(value: unknown, res: Response, next: () => unknown): void

  /**
   * Handles the request to get lessons
   * @param req - The lesson request containing group information.
   * @param res - The response object to send data.
   * @param next - The next middleware function.
   * @returns A promise that resolves when the response is sent.
   */
  public async getLessons(
    req: LessonRequest,
    res: Response,
    next: () => unknown
  ) {
    await this.absGetLessonsAsJson(
      (params: GroupId) => this.lessonsProvider.getLessons(params),
      req,
      res,
      next
    )
  }

  /**
   * Handles the request to get lessons with lessonType: lection
   * @param req - The lesson request containing group information.
   * @param res - The response object to send data.
   * @param next - The next middleware function.
   * @returns A promise that resolves when the response is sent.
   */
  public async getLections(
    req: LessonRequest,
    res: Response,
    next: () => unknown
  ) {
    await this.absGetLessonsAsJson(
      (params: GroupId) => this.lessonsProvider.getLections(params),
      req,
      res,
      next
    )
  }
}

export class JsonLessonsController extends LessonController {
  protected prepareScheduleBeforeSending(schedule: ISchedule): unknown {
    return schedule
  }

  protected sendResponse(value: unknown, res: Response, next: () => unknown): void {
    res.json(value)
    next()
  }
}

export class IcalLessonsController extends LessonController {
  protected prepareScheduleBeforeSending(schedule: ISchedule): unknown {
    return schedule.toIcalSchedule()
  }
  protected sendResponse(value: unknown, res: Response, next: () => unknown): void {
    res.send(value)
    next()
  }
}
