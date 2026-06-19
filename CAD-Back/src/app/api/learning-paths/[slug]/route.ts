/**
 * GET    /api/learning-paths/:slug         — detalle público
 * PUT    /api/learning-paths/:slug  admin  — actualiza metadata (steps no, ver POST)
 * DELETE /api/learning-paths/:slug  admin  — borra (cascade en steps)
 */
import { NextRequest } from 'next/server';
import { ok, noContent, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const path = await prisma.learningPath.findUnique({
      where: { slug },
      include: { steps: { orderBy: { sortOrder: 'asc' }, include: { resource: true } } },
    });
    if (!path) return notFound(`Ruta "${slug}" no encontrada.`);
    return ok(path);
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
    const updated = await prisma.learningPath.update({
      where: { slug },
      data: {
        title: body.title,
        description: body.description,
        level: body.level,
        totalDurationMinutes: body.totalDurationMinutes,
        outcomes: body.outcomes,
        coverImageUrl: body.coverImageUrl,
        published: body.published,
      },
    });
    return ok(updated);
  } catch (err) {
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
    await prisma.learningPath.delete({ where: { slug } });
    return noContent();
  } catch (err) {
    return serverError(err);
  }
}
