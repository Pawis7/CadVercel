/**
 * GET /api/content/audiences/:slug
 * Detalle de una audiencia con sub-niveles, topics y series recomendadas.
 */
import { NextRequest } from 'next/server';
import { notFound, ok, badRequest, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';
import { isAdmin, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const audience = await prisma.audience.findUnique({
      where: { slug },
      include: {
        subLevels: { orderBy: { sortOrder: 'asc' } },
        topics: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!audience) return notFound(`Audiencia "${slug}" no encontrada.`);

    const recommendedSeries = await prisma.videoSeries.findMany({
      where: { audience: audience.audience },
      orderBy: { sortOrder: 'asc' },
    });

    return ok({ ...audience, recommendedSeries });
  } catch (err) {
    return serverError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.title       !== undefined) data.name        = body.title.trim();
    if (body.description !== undefined) data.description = body.description.trim();
    if (body.imageUrl    !== undefined) data.imageUrl    = body.imageUrl.trim();

    if (Object.keys(data).length === 0) {
      return badRequest('Sin campos para actualizar.');
    }

    const updated = await prisma.audience.update({
      where: { slug },
      data,
    });
    return ok(updated);
  } catch (err) {
    return serverError(err);
  }
}

