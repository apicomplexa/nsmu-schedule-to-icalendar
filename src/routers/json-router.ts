import express from 'express'
import { LessonData } from '#/types/lesson'
import { GroupId } from '#/types/repository'
import { ISchedule } from '#/types/schedule'

const lessonsMiddlewareFactory = (
  getLessonsFunc: (params: GroupId) => Promise<LessonData[]>
) => {
  return async (
    req: express.Request<{
      curse: string
      group: string
      spec: string
    }>,
    res: express.Response,
    next: () => unknown
  ) => {
    const lessons = await getLessonsFunc({
      group: `${req.params.curse}/${req.params.group}`,
      spec: req.params.spec,
    })
    res.json(lessons)
    next()
  }
}

const logMiddleware = (
  req: express.Request<{
    curse: string
    group: string
    spec: string
  }>,
  res: express.Response,
  next: () => unknown
) => {
  console.log('Request', req.params)
  next()
}

interface LessonsProvider {
  getLessons(params: GroupId): Promise<ISchedule>
  getLections(params: GroupId): Promise<ISchedule>
}

export const JsonRouterFabric = (lessonsProvider: LessonsProvider): express.Router => {
  const router = express.Router()

  router.get('/all/:curse/:group/:spec', [
    logMiddleware,
    lessonsMiddlewareFactory((params) => lessonsProvider.getLessons(params)),
  ])

  router.get('/lections/:curse/:group/:spec', [
    logMiddleware,
    lessonsMiddlewareFactory((params) => lessonsProvider.getLections(params)),
  ])

  return router
}
