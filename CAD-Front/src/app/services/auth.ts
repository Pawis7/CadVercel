import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: string;
  role: 'ADMIN' | 'USER' | 'EDITOR';
  createdAt: string;
  updatedAt: string;
}

export interface AuthMessageResponse {
  message: string;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Signals for reactive application state
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  /**
   * Log in user.
   * El backend setea la cookie HttpOnly 'cad_token' automáticamente.
   * El frontend nunca toca el token — es invisible para JavaScript.
   */
  login(credentials: { email: string; password?: string }): Observable<User> {
    return this.http.post<AuthMessageResponse>(
      `${this.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(() => this.isAuthenticated.set(true)),
      switchMap(() => this.fetchMe())
    );
  }

  /**
   * Register a new user.
   * El backend setea la cookie HttpOnly automáticamente al registrarse.
   */
  register(userData: { firstName: string; lastName: string; email: string; password?: string }): Observable<User> {
    return this.http.post<AuthMessageResponse>(
      `${this.apiUrl}/auth/register`,
      userData
    ).pipe(
      tap(() => this.isAuthenticated.set(true)),
      switchMap(() => this.fetchMe())
    );
  }

  /**
   * Fetch authenticated user details.
   * La cookie HttpOnly se envía automáticamente por el browser.
   */
  fetchMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if a session cookie exists (sondeo de presencia, no del valor).
   * NOTA: La cookie 'cad_token' es HttpOnly → JS no puede leerla.
   * Usamos el estado reactivo (signal) o la llamada /me para verificar sesión.
   */
  hasSession(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Clear auth session. El backend expira las cookies de forma segura.
   */
  logout(): void {
    this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).subscribe({
      complete: () => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        // Incluso si falla el server, limpiamos el estado local
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Limpia la sesión en el frontend sin llamar al backend.
   * Útil cuando el backend ya nos rechazó con 401 en peticiones normales.
   */
  clearSession(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Initialize authentication on app boot.
   * Hace un ping al servidor para verificar si la cookie aún es válida.
   */
  private initAuth(): void {
    this.fetchMe().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isAuthenticated.set(false);
        this.isLoading.set(false);
      }
    });
  }
}
