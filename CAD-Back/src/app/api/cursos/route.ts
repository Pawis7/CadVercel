/**
 * GET  /api/cursos?audience=&level=&q=     — listado público
 * POST /api/cursos    admin                 — crear curso
 */
import { NextRequest } from 'next/server';
import { ok, badRequest, created, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const where: Record<string, unknown> = { published: true };
    if (sp.get('audience')) where.audience = sp.get('audience');
    if (sp.get('level'))    where.level    = sp.get('level');
    if (sp.get('q')) {
      where.OR = [
        { title:            { contains: sp.get('q')!, mode: 'insensitive' } },
        { shortDescription: { contains: sp.get('q')!, mode: 'insensitive' } },
      ];
    }
    const courses = await prisma.course.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return ok(courses);
  } catch (err) { return serverError(err); }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json();
    if (!body?.slug || !body?.title) return badRequest('slug y title son requeridos.');
    const course = await prisma.course.create({ data: body });
    return created(course);
  } catch (err) { return serverError(err); }
}
