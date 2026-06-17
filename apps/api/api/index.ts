import 'reflect-metadata'
import type { Request, Response } from 'express'
import { createApp } from '../src/bootstrap'

type ServerlessHandler = (request: Request, response: Response) => void

let handlerPromise: Promise<ServerlessHandler> | undefined

async function getHandler(): Promise<ServerlessHandler> {
  if (!handlerPromise) {
    handlerPromise = createApp().then(async (app) => {
      await app.init()
      return app.getHttpAdapter().getInstance() as ServerlessHandler
    })
  }

  return handlerPromise
}

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const server = await getHandler()
  server(request, response)
}
