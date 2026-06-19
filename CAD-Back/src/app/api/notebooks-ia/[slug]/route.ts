import { NextRequest } from 'next/server';
import { ok, noContent, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_r: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const nb = await prisma.aINotebook.findUnique({ where: { slug } });
    return nb ? ok(nb) : notFound(`Notebook "${slug}" no encontrado.`);
  } catch (err) { return serverError(err); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    const updated = await prisma.aINotebook.update({ where: { slug }, data: await req.json() });
    return ok(updated);
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    await prisma.aINotebook.delete({ where: { slug } });
    return noContent();
  } catch (err) { return serverError(err); }
}
