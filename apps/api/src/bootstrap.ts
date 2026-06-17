import type { INestApplication } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { isAllowedCorsOrigin, parseCorsOrigins } from './config/cors'

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1')

  app.use(
    (
      _req: unknown,
      res: {
        setHeader: (name: string, value: string) => void
      },
      next: () => void
    ) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-XSS-Protection', '0')
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      )
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
      )
      next()
    }
  )

  const allowedOrigins = parseCorsOrigins(process.env.CORS_ORIGINS)
  app.enableCors({
    origin: (origin, callback) => {
      if (isAllowedCorsOrigin(origin, allowedOrigins)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Sentinel Core API')
    .setDescription('Internal QA operations platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)
}

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule)
  configureApp(app)
  return app
}
