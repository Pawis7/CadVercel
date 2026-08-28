import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Asegurar que todas las peticiones a nuestra API incluyan credenciales
  // (permite que el browser envíe automáticamente la cookie HttpOnly)
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Rutas de auth excluidas para evitar bucles infinitos.
      // /auth/logout está aquí: si logout falla (raro), no intentamos hacer logout de nuevo.
      const isAuthPath = req.url.includes('/auth/login') ||
                         req.url.includes('/auth/register') ||
                         req.url.includes('/auth/logout') ||
                         req.url.includes('/auth/me');

      if (error.status === 401 && !isAuthPath) {
        // logout() llama al servidor → el servidor borra las cookies HttpOnly con
        // res.clearCookie(). JavaScript solo puede borrar cookies sin HttpOnly,
        // por eso la limpieza DEBE hacerse server-side.
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
