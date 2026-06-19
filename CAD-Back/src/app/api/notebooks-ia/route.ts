/**
 * GET  /api/notebooks-ia?audience=&kind=     — listado público
 * POST /api/notebooks-ia    admin             — crear notebook
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
    const list = await prisma.aINotebook.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return ok(list);
  } catch (err) { return serverError(err); }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json();
    if (!body?.slug || !body?.title || !body?.externalUrl) {
      return badRequest('slug, title y externalUrl son requeridos.');
    }
    const nb = await prisma.aINotebook.create({ data: body });
    return created(nb);
  } catch (err) { return serverError(err); }
}
