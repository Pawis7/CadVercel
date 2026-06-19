/**
 * Utilidades de autenticación JWT via httpOnly cookie.
 *
 * El JWT NUNCA se expone a JavaScript. Solo se lee en el servidor
 * a través de la cookie 'cdj_session', que es httpOnly + SameSite=Strict.
 *
 * Uso en route handlers:
 *   const payload = verifySession(request);
 *   if (!payload) return unauthorized();
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './crypto';

export const SESSION_COOKIE = 'cdj_session';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_alfa_cdj_2026';

export interface SessionPayload {
  userId: string;
  email: string;
  exp: number;
}

/**
 * Verifica el JWT en la cookie de sesión.
 * Devuelve el payload si es válido, null si no existe o expiró.
 */
export function verifySession(request: NextRequest | Request): SessionPayload | null {
  try {
    let token = '';
    const authHeader = request.headers.get('authorization') ?? '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = request.headers.get('cookie') ?? '';
      token = parseCookie(cookieHeader, SESSION_COOKIE) ?? '';
    }
    if (!token) return null;

    const payload = verifyToken(token, JWT_SECRET) as unknown as SessionPayload;
    if (!payload) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Atajo: true si la sesión es válida (para guards de endpoints admin).
 */
export function isAdmin(request: NextRequest | Request): boolean {
  return verifySession(request) !== null;
}

export function unauthorized(message = 'Sesión requerida o expirada.') {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Parsea una cookie específica del header Cookie.
 */
function parseCookie(header: string, name: string): string | null {
  const parts = header.split(';');
  for (const part of parts) {
    const [k, v] = part.trim().split('=');
    if (k === name && v) return decodeURIComponent(v);
  }
  return null;
}
