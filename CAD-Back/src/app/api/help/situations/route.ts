/**
 * GET /api/help/situations
 * Lista de situaciones frecuentes para Ayuda Digital.
 */
import { ok, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.helpSituation.findMany({ orderBy: { sortOrder: 'asc' } });
    return ok(list);
  } catch (err) {
    return serverError(err);
  }
}
