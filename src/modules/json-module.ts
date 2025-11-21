import { Module } from '#T/module'
import { LessonsProvider } from '#/providers/lessons/lessons-provider'
import { JsonLessonsController } from '#/controllers/lessons-controller'
import { webScraperRepo } from '#/repositories/scraper'
import { LessonsRouterFactory } from '#/routers/lessons-router'

export const JsonModule = (): Module => {
  const provider = new LessonsProvider(webScraperRepo)
  const controller = new JsonLessonsController(provider)
  const router = LessonsRouterFactory(controller)
  return { router }
}
