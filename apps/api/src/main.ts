import { Logger } from '@nestjs/common'
import { createApp } from './bootstrap'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await createApp()

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  logger.log(`API running on http://localhost:${port}`)
  logger.log(`Swagger: http://localhost:${port}/api/docs`)
}

bootstrap()
