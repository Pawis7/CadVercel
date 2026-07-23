import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CursosModule } from './cursos/cursos.module';
import { ReelsModule } from './reels/reels.module';

@Module({
  imports: [
    // ConfigModule carga el .env y lo hace disponible globalmente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ─── Rate Limiting ─────────────────────────────────────────────────────
    // 'default': 30 peticiones cada 60 s por IP (límite general de la API)
    // 'auth':     5 peticiones cada 60 s por IP (específico para login/register)
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 30 },
      { name: 'auth',    ttl: 60_000, limit: 5  },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    CursosModule,
    ReelsModule,
  ],
  providers: [
    // Aplica el ThrottlerGuard de forma global a toda la API
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

