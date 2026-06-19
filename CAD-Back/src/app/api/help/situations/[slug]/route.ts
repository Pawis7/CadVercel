/**
 * GET /api/help/situations/:slug — detalle de situación con pasos a seguir.
 */
import { NextRequest } from 'next/server';
import { ok, notFound, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const situation = await prisma.helpSituation.findUnique({ where: { slug } });
    if (!situation) return notFound(`Situación "${slug}" no encontrada.`);
    return ok(situation);
  } catch (err) {
    return serverError(err);
  }
}
