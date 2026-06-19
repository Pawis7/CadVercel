/**
 * GET /api/videos/:id            — un video
 * PUT /api/videos/:id    admin   — actualizar (típicamente la URL YouTube)
 *
 * El caso de uso central es: el editor admin pega la URL de YouTube en
 * el formulario de un video; este endpoint la persiste sin tocar el
 * resto de la metadata.
 */
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ok, badRequest, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { videoUpdate } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const video = await prisma.video.findUnique({
      where: { id },
      include: { series: true },
    });
    if (!video) return notFound(`Video "${id}" no encontrado.`);
    return ok(video);
  } catch (err) {
    return serverError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    const data = videoUpdate.parse(await req.json());
    const updated = await prisma.video.update({ where: { id }, data });
    return ok(updated);
  } catch (err: unknown) {
    if (err instanceof ZodError) return badRequest(err);
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return notFound('Video no encontrado.');
    }
    return serverError(err);
  }
}
