/**
 * GET  /api/learning-paths               — lista pública (publicadas)
 * POST /api/learning-paths    admin      — crea ruta con sus pasos
 */
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ok, badRequest, created, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { learningPathCreate } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const audience = req.nextUrl.searchParams.get('audience') ?? undefined;
    const where: Record<string, unknown> = { published: true };
    if (audience) where.audience = audience;
    const list = await prisma.learningPath.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { steps: { orderBy: { sortOrder: 'asc' }, include: { resource: true } } },
    });
    return ok(list);
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json();
    const data = learningPathCreate.parse(body);
    const path = await prisma.learningPath.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        audience: data.audience,
        level: data.level,
        totalDurationMinutes: data.totalDurationMinutes,
        outcomes: data.outcomes,
        coverImageUrl: data.coverImageUrl,
        steps: { create: data.steps },
      },
      include: { steps: { include: { resource: true } } },
    });
    return created(path);
  } catch (err) {
    if (err instanceof ZodError) return badRequest(err);
    return serverError(err);
  }
}
