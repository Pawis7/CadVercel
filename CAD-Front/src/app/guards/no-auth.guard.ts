import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { map, catchError, of } from 'rxjs';

/**
 * Guard para rutas PÚBLICAS (login, register).
 * Si el usuario ya tiene sesión activa → redirige al dashboard.
 * Si no hay sesión → permite el acceso normal a la ruta.
 */
export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el signal ya confirma sesión activa → ir al dashboard
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Verificar contra el servidor (por si la cookie persiste de una sesión anterior)
  return authService.fetchMe().pipe(
    map(() => {
      // Si /me responde OK → ya hay sesión, redirigir
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError(() => {
      // No hay sesión válida → dejar pasar al login/register
      return of(true);
    })
  );
};
