import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthenticatedLayout } from './layouts/authenticated/authenticated';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  // Rutas públicas — si ya hay sesión activa, redirigen al dashboard
  { path: 'login',    component: Login,    canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  
  // Rutas protegidas globales que comparten el layout y el guard de autenticación
  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard }
      // Las futuras páginas pasando el login irán aquí como hijas
    ]
  },
  
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
