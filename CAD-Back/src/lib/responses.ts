/**
 * Helpers para respuestas HTTP coherentes en toda la API.
 * Todas las respuestas (éxito o error) cumplen el contrato:
 *   { data?: T, error?: string, meta?: { ... } }
 */
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(error: string | ZodError): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validación fallida.', issues: error.issues },
      { status: 400 },
    );
  }
  return NextResponse.json({ error }, { status: 400 });
}

export function notFound(error = 'Recurso no encontrado.'): NextResponse {
  return NextResponse.json({ error }, { status: 404 });
}

export function conflict(error: string): NextResponse {
  return NextResponse.json({ error }, { status: 409 });
}

export function serverError(error: unknown): NextResponse {
  const message =
    error instanceof Error ? error.message : 'Error interno del servidor.';
  console.error('[api]', error);
  return NextResponse.json({ error: message }, { status: 500 });
}
