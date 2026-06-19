import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para manejar CORS y seguridad.
 * Necesario para permitir que el frontend (:4200) envíe cookies httpOnly al backend (:4180).
 */
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';

  // Manejo de Preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const response = NextResponse.next();

  // Añadir headers de CORS a todas las respuestas
  if (origin === allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

/**
 * Solo aplicar a rutas de la API.
 */
export const config = {
  matcher: '/api/:path*',
};
