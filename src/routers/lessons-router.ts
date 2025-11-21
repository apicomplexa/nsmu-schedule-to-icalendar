import express from 'express'
import { ILessonsController } from '#T/lessons-controller'

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

export const LessonsRouterFactory = (
  controller: ILessonsController
): express.Router => {
  const router = express.Router()

  router.get('/all/:curse/:group/:spec', [
    logMiddleware,
    controller.getLessons.bind(controller),
  ])

  router.get('/lections/:curse/:group/:spec', [
    logMiddleware,
    controller.getLections.bind(controller),
  ])

  return router
}
