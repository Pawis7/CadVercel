/**
 * POST /api/content/series/[id]/sync-playlist   (admin)
 *
 * Body opcional: { playlistUrl?: string }
 *   - Si viene, se guarda como youtubePlaylistId de la serie (acepta URL o ID).
 *   - Si no viene, usa el playlistId ya guardado.
 *
 * Comportamiento: sólo INSERTA los videos que aún no existen en la serie
 * (compara por id, que es el YouTube videoId). Los videos editados a mano
 * no se tocan. Devuelve { added, skipped, total, syncedAt }.
 */
import { NextRequest } from 'next/server';
import { ok, badRequest, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { extractPlaylistId, fetchPlaylistItems } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(req)) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const series = await prisma.videoSeries.findUnique({
      where: { id },
      include: { videos: { select: { id: true, sortOrder: true } } },
    });
    if (!series) return notFound(`Serie "${id}" no encontrada.`);

    // Resolver playlistId: el del body (URL o ID) o el ya guardado
    let playlistId = series.youtubePlaylistId ?? null;
    if (body.playlistUrl) {
      const extracted = extractPlaylistId(String(body.playlistUrl));
      if (!extracted) return badRequest('URL o ID de playlist inválido.');
      playlistId = extracted;
    }
    if (!playlistId) {
      return badRequest('La serie no tiene playlist asociada. Manda playlistUrl en el body.');
    }

    // Trae items de YouTube
    const items = await fetchPlaylistItems(playlistId);
    if (items.length === 0) {
      return badRequest('La playlist no devolvió videos (¿es pública? ¿tiene items?).');
    }

    // IDs ya existentes: comparamos contra cualquier video cuya id termine
    // con el videoId de YouTube (tolera prefijos como "casi-1" o el videoId directo)
    const existingIds = new Set(series.videos.map((v) => v.id));
    const existingYoutubeIds = new Set(
      series.videos
        .map((v) => extractYoutubeIdFromUrl(v.id))
        .filter(Boolean) as string[],
    );

    // sortOrder máximo actual
    const maxSort = series.videos.reduce(
      (m, v) => (v.sortOrder > m ? v.sortOrder : m),
      0,
    );

    let added = 0;
    let skipped = 0;
    let cursor = maxSort;

    for (const it of items) {
      const id = `${series.id}-yt-${it.videoId}`;
      if (existingIds.has(id) || existingYoutubeIds.has(it.videoId)) {
        skipped += 1;
        continue;
      }
      cursor += 1;
      await prisma.video.create({
        data: {
          id,
          seriesId: series.id,
          title: it.title,
          description: it.description.slice(0, 800) || null,
          youtubeUrl: `https://www.youtube.com/watch?v=${it.videoId}`,
          durationLabel: it.durationLabel,
          publishedAt: it.publishedAt ? new Date(it.publishedAt) : null,
          sortOrder: cursor,
        },
      });
      added += 1;
    }

    const updated = await prisma.videoSeries.update({
      where: { id: series.id },
      data: {
        youtubePlaylistId: playlistId,
        lastSyncedAt: new Date(),
      },
    });

    return ok({
      added,
      skipped,
      total: items.length,
      playlistId,
      syncedAt: updated.lastSyncedAt,
    });
  } catch (err) {
    return serverError(err);
  }
}

/**
 * Intenta sacar el videoId de un string que puede ser una URL guardada
 * en `Video.id` (no es lo normal aquí, pero por compatibilidad si alguien
 * lo metió así).
 */
function extractYoutubeIdFromUrl(s: string): string | null {
  const match = s.match(/(?:v=|youtu\.be\/|-yt-)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}
