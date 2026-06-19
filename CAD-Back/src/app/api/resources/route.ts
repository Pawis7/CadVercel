/**
 * GET  /api/resources?audience=&level=&theme=&format=&q=&take=&skip=
 *      Lista paginada de recursos con filtros combinables.
 *
 * POST /api/resources         (admin)
 *      Crea un recurso. Body validado con `resourceCreate`.
 */
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ok, badRequest, created, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resourceCreate } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const audience = sp.get('audience') ?? undefined;
    const level    = sp.get('level')    ?? undefined;
    const theme    = sp.get('theme')    ?? undefined;
    const format   = sp.get('format')   ?? undefined;
    const q        = sp.get('q')        ?? undefined;
    const take     = Math.min(Number(sp.get('take') ?? 24), 100);
    const skip     = Number(sp.get('skip') ?? 0);

    const where: Record<string, unknown> = { published: true };
    if (audience) where.audienceSlug = audience;
    if (level)    where.level        = level;
    if (theme)    where.theme        = theme;
    if (format)   where.format       = format;
    if (q) {
      where.OR = [
        { title:       { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take, skip,
      }),
      prisma.resource.count({ where }),
    ]);

    return ok(items, { headers: { 'X-Total-Count': String(total) } });
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json();
    const data = resourceCreate.parse(body);
    const resource = await prisma.resource.create({
      data: {
        ...data,
        learningOutcomes: data.learningOutcomes,
        howToUse: data.howToUse,
        tags: data.tags,
      },
    });
    return created(resource);
  } catch (err) {
    if (err instanceof ZodError) return badRequest(err);
    return serverError(err);
  }
}
