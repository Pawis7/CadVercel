/**
 * GET /api/content/series             — todas las series con sus videos
 * GET /api/content/series?slug=foo    — una serie por slug
 */
import { NextRequest } from 'next/server';
import { ok, notFound, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');

    if (slug) {
      const serie = await prisma.videoSeries.findUnique({
        where: { slug },
        include: { videos: { orderBy: { sortOrder: 'asc' } } },
      });
      if (!serie) return notFound(`Serie "${slug}" no encontrada.`);
      return ok(serie);
    }

    const series = await prisma.videoSeries.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { videos: { orderBy: { sortOrder: 'asc' } } },
    });
    return ok(series);
  } catch (err) {
    return serverError(err);
  }
}
