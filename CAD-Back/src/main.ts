import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ─── Límite de tamaño de payload — previene DoS por cuerpos masivos ────────────
  // 2 MB es suficiente para cualquier curso con contenido HTML extenso.
  app.use(require('express').json({ limit: '2mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '2mb' }));

  // ─── Cookie Parser ───────────────────────────────────────────────────────────────
  // Necesario para que Express pueda leer req.cookies (HttpOnly cookies)
  app.use(cookieParser());

  // ─── Helmet: cabeceras HTTP seguras ────────────────────────────────────────────────────
  // Aplica automáticamente: X-Frame-Options, X-Content-Type-Options,
  // Strict-Transport-Security, Content-Security-Policy, etc.
  app.use(helmet());

  // ─── Validación global de DTOs (class-validator) ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Lanza error si vienen propiedades extra
      transform: true,            // Convierte automáticamente los tipos
    }),
  );

  // ─── CORS – solo permite el origen definido en .env ─────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });

  // ─── Prefijo global de la API ─────────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 API corriendo en: http://localhost:${port}/api`);
}
bootstrap();
