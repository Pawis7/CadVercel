/**
 * PUT    /api/images/:id   admin
 *   Body multipart/form-data con campo `file` (imagen). Sobrescribe la
 *   imagen de ese ID. Persiste en disco + actualiza tabla ImageOverride.
 *
 * DELETE /api/images/:id   admin
 *   Elimina el override (vuelve a la imagen base del front).
 */
import { NextRequest } from 'next/server';
import { ok, badRequest, noContent, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveUploadedImage, SUPPORTED_IMAGE_MIME } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return badRequest('Falta el campo "file" en multipart.');
    if (!SUPPORTED_IMAGE_MIME.includes(file.type)) {
      return badRequest(`Mime no soportado: ${file.type}`);
    }
    if (file.size > 10 * 1024 * 1024) {
      return badRequest('La imagen pesa más de 10 MB.');
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const saved = await saveUploadedImage(id, buf, file.type);

    const override = await prisma.imageOverride.upsert({
      where: { id },
      update: {
        url:       saved.url,
        format:    saved.ext,
        sizeBytes: saved.bytes,
      },
      create: {
        id,
        url:       saved.url,
        format:    saved.ext,
        sizeBytes: saved.bytes,
      },
    });
    return ok(override);
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    await prisma.imageOverride.delete({ where: { id } }).catch(() => null);
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}
