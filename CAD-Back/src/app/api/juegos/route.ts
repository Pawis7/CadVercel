/**
 * GET  /api/juegos?audience=&kind=&age=     — listado público
 * POST /api/juegos    admin                  — crear juego
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
    if (sp.get('kind'))     where.kind     = sp.get('kind');
    if (sp.get('age')) {
      const age = Number(sp.get('age'));
      if (!isNaN(age)) {
        where.AND = [
          { OR: [{ ageMin: null }, { ageMin: { lte: age } }] },
          { OR: [{ ageMax: null }, { ageMax: { gte: age } }] },
        ];
      }
    }
    const games = await prisma.game.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return ok(games);
  } catch (err) { return serverError(err); }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json();
    if (!body?.slug || !body?.title) return badRequest('slug y title son requeridos.');
    const game = await prisma.game.create({ data: body });
    return created(game);
  } catch (err) { return serverError(err); }
}
