import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  // En modo MOCK: siempre autenticado, sin llamadas HTTP
  if (environment.mock) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el signal ya está autenticado (en memoria), pasar directamente
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si el signal dice "no autenticado", intentar validar contra el servidor
  // (el browser enviará automáticamente la cookie HttpOnly si existe)
  return authService.fetchMe().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
