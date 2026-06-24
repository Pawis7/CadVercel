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
      // Evitar bucles y redirecciones redundantes si la petición ya es de sesión básica/auth
      const isAuthPath = req.url.includes('/auth/login') ||
                         req.url.includes('/auth/register') ||
                         req.url.includes('/auth/logout') ||
                         req.url.includes('/auth/me');

      if (error.status === 401 && !isAuthPath) {
        authService.clearSession();
      }
      return throwError(() => error);
    })
  );
};
