import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession, unauthorized } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Verifica la cookie de sesión y devuelve los datos del usuario si es válida.
 * El frontend llama a este endpoint al arrancar para saber si hay sesión activa.
 */
export async function GET(request: NextRequest) {
  const session = verifySession(request);
  if (!session) return unauthorized();

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) return unauthorized('Usuario no encontrado.');

  return NextResponse.json({ user });
}
