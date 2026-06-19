import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Elimina la cookie de sesión del navegador.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,   // ← expiración inmediata
    path: '/',
  });

  return response;
}
