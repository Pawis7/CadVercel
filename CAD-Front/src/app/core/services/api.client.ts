/**
 * Cliente HTTP minimalista para el backend de CDJ.
 *
 * Pensado para que el ContentService lo use con timeout corto y caída
 * graciosa al data estático cuando el backend no responde. NO usa el HttpClient
 * de Angular porque queremos AbortController nativo y respuesta tipada simple.
 */
import { Injectable } from '@angular/core';
import { API_BASE, API_TIMEOUT_MS, getAdminToken } from './api.config';

interface ApiEnvelope<T> { data?: T; error?: string; issues?: unknown[]; }

export class ApiError extends Error {
  constructor(public status: number, message: string, public issues?: unknown[]) {
    super(message);
    this.name = 'ApiError';
  }
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  /** GET tipado con timeout. */
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>('GET', path, undefined, init);
  }

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>('POST', path, body, init);
  }

  async put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>('PUT', path, body, init);
  }

  async patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', path, body, init);
  }

  async del<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', path, undefined, init);
  }

  /** Subida multipart (PUT /api/images/:id, POST /api/upload). */
  async putMultipart<T>(path: string, form: FormData): Promise<T> {
    return this.request<T>('PUT', path, form, { isMultipart: true } as never);
  }

  async postMultipart<T>(path: string, form: FormData): Promise<T> {
    return this.request<T>('POST', path, form, { isMultipart: true } as never);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    init?: RequestInit & { isMultipart?: boolean },
  ): Promise<T> {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);

    const headers = new Headers(init?.headers);
    const isAdmin = path.startsWith('/admin/') || ['POST','PUT','PATCH','DELETE'].includes(method);
    const token = isAdmin ? getAdminToken() : null;
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let payload: BodyInit | undefined;
    if (body !== undefined && !init?.isMultipart) {
      headers.set('Content-Type', 'application/json');
      payload = JSON.stringify(body);
    } else if (body instanceof FormData) {
      payload = body;
    }

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: payload,
        signal: ctrl.signal,
        credentials: 'include',  // Envia cookies httpOnly para autenticacion
      });
      const ct = res.headers.get('content-type') ?? '';
      const json: ApiEnvelope<T> = ct.includes('application/json')
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok) {
        throw new ApiError(res.status, json.error ?? `HTTP ${res.status}`, json.issues);
      }
      // Convención: cuerpo viene como { data: T }; si el endpoint devuelve T directo, lo aceptamos.
      return (json.data ?? (json as unknown as T));
    } finally {
      clearTimeout(timeout);
    }
  }
}
