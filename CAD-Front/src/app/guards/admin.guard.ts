import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { map, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';


/**
 * Guard para la ruta /admin.
 *
 * Estrategia de seguridad en capas:
 * 1. Si no hay sesión activa → redirige a /login.
 * 2. Si hay usuario en memoria y NO es ADMIN → redirige a /inicio (sin petición al backend).
 * 3. Si hay usuario en memoria y es ADMIN → llama a /auth/admin-verify en el backend
 *    para confirmar que el rol no ha cambiado en la DB (tokens stale).
 * 4. Si no hay usuario en memoria → intenta /me para obtener datos y luego verifica el rol.
 * 5. Cualquier fallo de red o 403 redirige a /inicio.
 */
export const adminGuard: CanActivateFn = () => {
  // En modo MOCK: el usuario demo no es ADMIN → redirigir a inicio
  if (environment.mock) {
    const router = inject(Router);
    router.navigate(['/inicio']);
    return false;
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);

  const apiUrl = 'http://localhost:3000/api';

  /** Verifica el rol ADMIN directamente en el backend (fuente de verdad). */
  const verifyAdminOnServer = () =>
    http.get(`${apiUrl}/auth/admin-verify`).pipe(
      map(() => true as const),
      catchError(() => {
        router.navigate(['/inicio']);
        return of(false as const);
      }),
    );

  // ── Caso 1: No hay sesión ──────────────────────────────────────────────────
  if (!authService.isAuthenticated()) {
    // Intentar recuperar la sesión mediante la cookie HttpOnly
    return authService.fetchMe().pipe(
      switchMap((user) => {
        if (user.role !== 'ADMIN') {
          router.navigate(['/inicio']);
          return of(false as const);
        }
        return verifyAdminOnServer();
      }),
      catchError(() => {
        router.navigate(['/login']);
        return of(false as const);
      }),
    );
  }

  // ── Caso 2: Hay sesión pero el usuario en memoria NO es ADMIN ──────────────
  const user = authService.currentUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.role !== 'ADMIN') {
    router.navigate(['/inicio']);
    return false;
  }

  // ── Caso 3: Hay sesión y role === ADMIN → confirmar en el backend ──────────
  return verifyAdminOnServer();
};
