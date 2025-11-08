import express from 'express'
import { getLections, getLessons, UrlArgs } from '#/scraper'
import { ILesson } from '#types/lesson'

const lessonsMiddlewareFactory = (
  getLessonsFunc: (params: UrlArgs) => Promise<ILesson[]>
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

export const JsonRouterFabric = (): express.Router => {
  const router = express.Router()

  router.get('/all/:curse/:group/:spec', [
    logMiddleware,
    lessonsMiddlewareFactory(getLessons),
  ])

  router.get('/lections/:curse/:group/:spec', [
    logMiddleware,
    lessonsMiddlewareFactory(getLections),
  ])

  return router
}
