import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Inicio } from './pages/inicio/inicio';
import { Cursos } from './pages/cursos/cursos';
import { CrearCurso } from './pages/crear-curso/crear-curso';
import { CursoDetalle } from './pages/curso-detalle/curso-detalle';
import { AuthenticatedLayout } from './layouts/authenticated/authenticated';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Rutas públicas — si ya hay sesión activa, redirigen a inicio
  { path: 'login',    component: Login,    canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  
  // Rutas protegidas globales que comparten el layout y el guard de autenticación
  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'dashboard', component: Dashboard },
      { path: 'cursos', component: Cursos },
      // ── Rutas de administración — requieren sesión activa + rol ADMIN verificado en la DB
      { path: 'admin',         component: AdminDashboard, canActivate: [adminGuard] },
      { path: 'cursos/nuevo',  component: CrearCurso,     canActivate: [adminGuard] },
      { path: 'cursos/:id',    component: CursoDetalle },
    ]
  },
  
  { path: '',   redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
