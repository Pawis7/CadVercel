/**
 * Cliente Prisma único para toda la app.
 *
 * En dev, Next.js hot-reloads el módulo y crea un cliente nuevo cada vez,
 * lo que termina abriendo demasiadas conexiones a Postgres. El truco
 * de pegarlo en `globalThis` lo evita.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
