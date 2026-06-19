/**
 * POST /api/upload    admin
 *
 * Subida de archivos genérica (no atada a un imageId concreto). Útil para
 * banners nuevos, downloads de recursos, etc. Devuelve la URL pública.
 *
 * Body: multipart/form-data
 *   - file: File (requerido)
 *   - prefix?: string (opcional, p.ej. "banners", "recursos/r1")
 */
import { NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ok, badRequest, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { saveUploadedImage, SUPPORTED_IMAGE_MIME } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const form = await req.formData();
    const file = form.get('file');
    const prefix = (form.get('prefix') as string | null)?.replace(/[^a-z0-9_\-/]/gi, '_') ?? 'misc';
    if (!(file instanceof File)) return badRequest('Falta el campo "file" en multipart.');
    if (!SUPPORTED_IMAGE_MIME.includes(file.type)) {
      return badRequest(`Mime no soportado: ${file.type}`);
    }
    if (file.size > 10 * 1024 * 1024) {
      return badRequest('El archivo pesa más de 10 MB.');
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const id = `${prefix}/${randomUUID().slice(0, 8)}`;
    const saved = await saveUploadedImage(id, buf, file.type);
    return ok({ url: saved.url, bytes: saved.bytes, format: saved.ext });
  } catch (err) {
    return serverError(err);
  }
}
