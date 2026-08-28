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
  // ── Rutas públicas — si ya hay sesión activa, redirigen a /inicio ──────────
  { path: 'login',    component: Login,    canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },

  // ── Rutas protegidas — requieren sesión activa (cookie HttpOnly válida) ─────
  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      // Redirige la raíz a /inicio dentro del layout protegido
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',    component: Inicio },
      { path: 'dashboard', component: Dashboard },
      { path: 'cursos',    component: Cursos },
      // ── Rutas de administración — rol ADMIN verificado en DB ────────────────
      { path: 'admin',        component: AdminDashboard, canActivate: [adminGuard] },
      { path: 'cursos/nuevo', component: CrearCurso,     canActivate: [adminGuard] },
      { path: 'cursos/:id',   component: CursoDetalle },
    ],
  },

  // ── Cualquier ruta desconocida → login ──────────────────────────────────────
  { path: '**', redirectTo: '/login' },
];
