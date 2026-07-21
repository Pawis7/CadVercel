import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Guard para rutas PÚBLICAS (login, register).
 * Si el usuario ya tiene sesión activa → redirige a inicio.
 * Si no hay sesión → permite el acceso normal a la ruta.
 *
 * En modo MOCK: se deja pasar (permite visitar /login para la demo).
 */
export const noAuthGuard: CanActivateFn = () => {
  // En modo MOCK: dejar pasar al login/register libremente
  if (environment.mock) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el signal ya confirma sesión activa → ir a inicio
  if (authService.isAuthenticated()) {
    router.navigate(['/inicio']);
    return false;
  }

  // Verificar contra el servidor (por si la cookie persiste de una sesión anterior)
  return authService.fetchMe().pipe(
    map(() => {
      // Si /me responde OK → ya hay sesión, redirigir
      router.navigate(['/inicio']);
      return false;
    }),
    catchError(() => {
      // No hay sesión válida → dejar pasar al login/register
      return of(true);
    })
  );
};
