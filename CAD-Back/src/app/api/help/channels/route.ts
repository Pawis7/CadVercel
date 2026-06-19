/**
 * GET /api/help/channels
 * Canales oficiales de orientación, atención y denuncia.
 */
import { ok, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.helpChannel.findMany({ orderBy: { sortOrder: 'asc' } });
    return ok(list);
  } catch (err) {
    return serverError(err);
  }
}
