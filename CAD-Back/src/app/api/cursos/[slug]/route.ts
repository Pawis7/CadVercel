import { NextRequest } from 'next/server';
import { ok, noContent, notFound, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_r: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const c = await prisma.course.findUnique({ where: { slug } });
    return c ? ok(c) : notFound(`Curso "${slug}" no encontrado.`);
  } catch (err) { return serverError(err); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    const body = await req.json();
    const updated = await prisma.course.update({ where: { slug }, data: body });
    return ok(updated);
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { slug } = await params;
    await prisma.course.delete({ where: { slug } });
    return noContent();
  } catch (err) { return serverError(err); }
}
