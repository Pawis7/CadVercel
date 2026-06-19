/**
 * GET /api/images
 * Mapa de overrides de imágenes (id → url) para que el front las resuelva
 * en bloque al boot. Reemplaza el localStorage que usa hoy editable-image.
 */
import { ok, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const overrides = await prisma.imageOverride.findMany();
    const map: Record<string, string> = {};
    for (const o of overrides) map[o.id] = o.url;
    return ok(map);
  } catch (err) {
    return serverError(err);
  }
}
