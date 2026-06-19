/**
 * GET /api/content/audiences           — lista todas las audiencias
 */
import { ok, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const audiences = await prisma.audience.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        subLevels: { orderBy: { sortOrder: 'asc' } },
        topics: { orderBy: { sortOrder: 'asc' } },
      },
    });
    return ok(audiences);
  } catch (err) {
    return serverError(err);
  }
}
