import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MOCK_USER } from '../mock/mock-data';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  // URL absoluta del backend — el interceptor añade withCredentials en todas las peticiones
  private readonly apiUrl = 'http://localhost:3000/api';

  // Signals for reactive application state
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  /**
   * Log in user.
   * En modo MOCK: acepta cualquier credencial y logea con el usuario demo.
   * En producción: el backend setea la cookie HttpOnly 'cad_token' automáticamente.
   */
  login(credentials: { email: string; password?: string }): Observable<User> {
    if (environment.mock) {
      this.currentUser.set(MOCK_USER);
      this.isAuthenticated.set(true);
      this.isLoading.set(false);
      return of(MOCK_USER);
    }

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
   * En modo MOCK: registra con el usuario demo automáticamente.
   * En producción: el backend setea la cookie HttpOnly automáticamente al registrarse.
   */
  register(userData: { firstName: string; lastName: string; email: string; password?: string }): Observable<User> {
    if (environment.mock) {
      const mockNewUser: User = {
        ...MOCK_USER,
        firstName: userData.firstName || MOCK_USER.firstName,
        lastName: userData.lastName || MOCK_USER.lastName,
        email: userData.email || MOCK_USER.email,
      };
      this.currentUser.set(mockNewUser);
      this.isAuthenticated.set(true);
      this.isLoading.set(false);
      return of(mockNewUser);
    }

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
   * En modo MOCK: devuelve el usuario demo directamente.
   * En producción: la cookie HttpOnly se envía automáticamente por el browser.
   */
  fetchMe(): Observable<User> {
    if (environment.mock) {
      this.currentUser.set(MOCK_USER);
      this.isAuthenticated.set(true);
      this.isLoading.set(false);
      return of(MOCK_USER);
    }

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
   * Clear auth session.
   * En modo MOCK: limpia el estado local y redirige.
   * En producción: el backend expira las cookies de forma segura.
   */
  logout(): void {
    if (environment.mock) {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
      return;
    }

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
   * En modo MOCK: auto-login con usuario demo sin ninguna llamada HTTP.
   * En producción: hace un ping al servidor para verificar si la cookie aún es válida.
   */
  private initAuth(): void {
    if (environment.mock) {
      this.currentUser.set(MOCK_USER);
      this.isAuthenticated.set(true);
      this.isLoading.set(false);
      return;
    }

    this.fetchMe().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isAuthenticated.set(false);
        this.isLoading.set(false);
      }
    });
  }
}
