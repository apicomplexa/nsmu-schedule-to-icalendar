import { LessonsProvider } from '#/providers/lessons/lessons-provider'
import { IcalLessonsController } from '#/controllers/lessons-controller'
import { webScraperRepo } from '#/repositories/scraper'
import { LessonsRouterFactory } from '#/routers/lessons-router'
import { Module } from '#T/module'

export const IcalModule = (): Module => {
  const provider = new LessonsProvider(webScraperRepo)
  const controller = new IcalLessonsController(provider)
  const router = LessonsRouterFactory(controller)
  return { router }
}
