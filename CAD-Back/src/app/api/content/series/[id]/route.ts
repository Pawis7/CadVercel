/**
 * PATCH /api/content/series/[id]
 * Actualiza campos de una serie de videos (admin)
 */
import { NextRequest } from 'next/server';
import { ok, badRequest, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.title       !== undefined) data.title       = body.title.trim();
    if (body.description !== undefined) data.description = body.description.trim();
    if (body.imageUrl    !== undefined) data.coverImageUrl = body.imageUrl.trim();
    if (body.youtubePlaylistId !== undefined) {
      // permite vaciar mandando "" o null
      const raw = body.youtubePlaylistId;
      data.youtubePlaylistId = raw === null || raw === '' ? null : String(raw).trim();
    }

    if (Object.keys(data).length === 0) {
      return badRequest('Sin campos para actualizar.');
    }

    const updated = await prisma.videoSeries.update({
      where: { id },
      data,
    });
    return ok(updated);
  } catch (err: any) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return notFound('Video series no encontrada.');
    }
    return serverError(err);
  }
}
