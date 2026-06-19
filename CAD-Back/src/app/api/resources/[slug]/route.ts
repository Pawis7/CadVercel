/**
 * GET    /api/resources/:slug          — detalle público
 * PUT    /api/resources/:slug   admin  — actualizar
 * DELETE /api/resources/:slug   admin  — borrar
 */
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ok, badRequest, noContent, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resourceUpdate } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const resource = await prisma.resource.findUnique({
      where: { slug },
      include: {
        downloads: { orderBy: { sortOrder: 'asc' } },
        related:   { include: { related: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!resource) return notFound(`Recurso "${slug}" no encontrado.`);
    return ok(resource);
  } catch (err) {
    return serverError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    const body = await req.json();
    const data = resourceUpdate.parse(body);
    const updated = await prisma.resource.update({ where: { slug }, data });
    return ok(updated);
  } catch (err: unknown) {
    if (err instanceof ZodError) return badRequest(err);
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return notFound('Recurso no encontrado.');
    }
    return serverError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    await prisma.resource.delete({ where: { slug } });
    return noContent();
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return notFound('Recurso no encontrado.');
    }
    return serverError(err);
  }
}
