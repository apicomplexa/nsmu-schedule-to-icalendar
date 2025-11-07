import express from 'express'
import { NsmuWebLoader, WebScheduleParser } from '#/scraper'

export const JsonRouterFabric = (nsmuBaseURL: string): express.Router => {
  const router = express.Router()
  const webLoader = new NsmuWebLoader(nsmuBaseURL)
  const parser = new WebScheduleParser()

  router.get('/:curse/:group/:spec', async (req, res) => {
    console.log(
      `Request ${req.params.curse}/${req.params.group}/${req.params.spec}`
    )
    const htmlSchedule = await webLoader.loadSchedule({
      group: `${req.params.curse}/${req.params.group}`,
      spec: req.params.spec,
    })
    const lessons = parser.parseWebSchedule(htmlSchedule)
    res.json(lessons)
  })

  return router
}
