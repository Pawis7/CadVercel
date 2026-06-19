/**
 * AuthService — gestión de sesión administrativa via httpOnly cookie.
 *
 * El JWT nunca toca JavaScript. El navegador lo guarda y envía automáticamente.
 * La fuente de verdad del estado de sesión es el endpoint GET /auth/me.
 *
 * Flujo:
 *  1. Al arrancar la app, se llama a checkSession() para ver si hay sesión activa.
 *  2. login()  → POST /auth/login → el backend setea la cookie httpOnly
 *  3. logout() → POST /auth/logout → el backend borra la cookie
 *  4. isLogged  → signal<boolean> derivado de currentUser (sin tocar el JWT)
 */
import { inject, Injectable, signal, computed } from '@angular/core';
import { API_BASE, API_TIMEOUT_MS } from './api.config';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = API_BASE;

  /** Usuario actual. null = sesión inexistente o no verificada aún. */
  currentUser = signal<AdminUser | null>(null);

  /**
   * true si hay sesión válida confirmada por el servidor.
   * Es el único dato que el front conoce del JWT — su existencia.
   * Úsalo para mostrar/ocultar controles de edición.
   */
  isLogged = computed(() => this.currentUser() !== null);

  /**
   * Verifica al backend si hay una cookie de sesión activa.
   * Llamar en el arranque de la app (APP_INITIALIZER o en el constructor de App).
   */
  async checkSession(): Promise<void> {
    try {
      const res = await fetch(`${this.base}/auth/me`, {
        method: 'GET',
        credentials: 'include',      // ← envía la cookie httpOnly automáticamente
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });

      if (res.ok) {
        const body = await res.json();
        this.currentUser.set(body.user ?? null);
      } else {
        this.currentUser.set(null);
      }
    } catch {
      this.currentUser.set(null);
    }
  }

  /**
   * Inicia sesión. El JWT lo guarda el backend en cookie httpOnly.
   * JavaScript nunca ve el token.
   */
  async login(email: string, password: string): Promise<AdminUser> {
    const res = await fetch(`${this.base}/auth/login`, {
      method: 'POST',
      credentials: 'include',       // ← necesario para que el browser acepte la cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.error || 'Error al iniciar sesión.');
    }

    this.currentUser.set(body.user);
    return body.user;
  }

  /**
   * Cierra sesión: el backend borra la cookie httpOnly.
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${this.base}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      });
    } finally {
      this.currentUser.set(null);
    }
  }
}
