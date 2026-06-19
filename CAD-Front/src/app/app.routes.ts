import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inicio/inicio').then((m) => m.InicioComponent),
    title: 'Inicio · Cursos Alfa Digital',
  },
  {
    path: 'cursos',
    loadComponent: () => import('./cursos/cursos').then((m) => m.CursosComponent),
    title: 'Cursos · Cursos Alfa Digital',
  },
  {
    path: 'cursos/:slug',
    loadComponent: () => import('./cursos/curso-detail').then((m) => m.CursoDetailComponent),
    title: 'Curso · Cursos Alfa Digital',
  },
  {
    path: 'AlfaAdminLogin',
    loadComponent: () => import('./auth/login').then((m) => m.LoginComponent),
    title: 'Acceso Administrativo · Cursos Alfa Digital',
  },
  { path: '**', redirectTo: '' },
];
