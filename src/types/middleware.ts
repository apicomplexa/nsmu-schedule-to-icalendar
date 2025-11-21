import express from 'express'

export type Middleware = (
  req: express.Request<{
    curse: string
    group: string
    spec: string
  }>,
  res: express.Response,
  next: () => unknown
) => Promise<void>
