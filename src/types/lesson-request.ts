import { Request } from 'express'

export type LessonRequest = Request<{
  curse: string
  group: string
  spec: string
}>
