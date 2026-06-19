/**
 * Helpers para guardar archivos subidos por el panel admin en disco.
 *
 * En dev: van a /public/uploads/{id}.{ext}
 * En prod: la misma ruta, servidor Ubuntu monta /var/www/cdj/uploads como
 * volumen apuntando a public/uploads.
 *
 * El identificador es el `imageId` del front (p.ej. "hero-main") + extensión.
 * Sobrescribir reemplaza el archivo, lo cual también invalida cualquier caché
 * por ETag (Next sirve mtime-based).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './public/uploads';

const EXT_BY_MIME: Record<string, string> = {
  'image/png':  'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

export async function saveUploadedImage(
  imageId: string,
  buffer: Buffer,
  mime: string,
): Promise<{ url: string; ext: string; bytes: number }> {
  const ext = EXT_BY_MIME[mime];
  if (!ext) throw new Error(`Mime type no soportado: ${mime}`);

  const safeId = imageId.replace(/[^a-z0-9_\-]/gi, '_');
  const dir = resolve(UPLOAD_DIR);
  await mkdir(dir, { recursive: true });

  const filename = `${safeId}.${ext}`;
  await writeFile(join(dir, filename), buffer);

  return {
    url: `/uploads/${filename}`,
    ext,
    bytes: buffer.byteLength,
  };
}

export const SUPPORTED_IMAGE_MIME = Object.keys(EXT_BY_MIME);
