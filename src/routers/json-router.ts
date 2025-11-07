import express from 'express'
import { getLessons } from '#/scraper'

export const JsonRouterFabric = (): express.Router => {
  const router = express.Router()

  router.get('/:curse/:group/:spec', async (req, res) => {
    console.log(
      `Request ${req.params.curse}/${req.params.group}/${req.params.spec}`
    )
    const lessons = await getLessons(
      `${req.params.curse}/${req.params.group}`,
      req.params.spec
    )
    res.json(lessons)
  })

  return router
}
