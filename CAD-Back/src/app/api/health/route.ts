/**
 * GET /api/health
 * Smoke-check para CI / load balancers / health probes.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ok',
      service: 'cad-back',
      time: new Date().toISOString(),
      db: 'up',
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'degraded', db: 'down', error: String(err) },
      { status: 503 },
    );
  }
}
