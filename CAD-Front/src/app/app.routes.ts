import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inicio/inicio').then((m) => m.InicioComponent),
    title: 'Inicio · Cursos Alfa Digital',
  },
  {
    path: 'series',
    loadComponent: () =>
      import('./series/series-list/series-list').then((m) => m.SeriesListComponent),
    title: 'Series · Cursos Alfa Digital',
  },
  {
    path: 'series/:slug',
    loadComponent: () =>
      import('./series/series-detail/series-detail').then((m) => m.SeriesDetailComponent),
    title: 'Serie · Cursos Alfa Digital',
  },
  {
    path: 'edutips',
    loadComponent: () => import('./edutips/edutips').then((m) => m.EdutipsComponent),
    title: 'Edutips · Cursos Alfa Digital',
  },
  {
    path: 'recurso/:slug',
    loadComponent: () => import('./recurso/recurso-detail').then((m) => m.RecursoDetailComponent),
    title: 'Recurso · Cursos Alfa Digital',
  },
  {
    path: 'recursos',
    loadComponent: () => import('./recursos/recursos').then((m) => m.RecursosComponent),
    title: 'Recursos · Cursos Alfa Digital',
  },
  {
    path: 'cursos',
    loadComponent: () => import('./cursos/cursos').then((m) => m.CursosComponent),
    title: 'Cursos · Cursos Alfa Digital',
  },
  {
    path: 'juegos',
    loadComponent: () => import('./juegos/juegos').then((m) => m.JuegosComponent),
    title: 'Juegos · Cursos Alfa Digital',
  },
  {
    path: 'notebooks-ia',
    loadComponent: () => import('./notebooks-ia/notebooks-ia').then((m) => m.NotebooksIaComponent),
    title: 'Notebooks IA · Cursos Alfa Digital',
  },
  {
    path: 'quienes-somos',
    loadComponent: () => import('./quienes-somos/quienes-somos').then((m) => m.QuienesSomosComponent),
    title: 'Quiénes somos · Cursos Alfa Digital',
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./ayuda/ayuda').then((m) => m.AyudaComponent),
    title: 'Ayuda Digital · Cursos Alfa Digital',
  },
  {
    path: 'p/:slug',
    loadComponent: () => import('./audiencia/audiencia').then((m) => m.AudienciaComponent),
    title: 'Cursos Alfa Digital',
  },
  {
    path: 'AlfaAdminLogin',
    loadComponent: () => import('./auth/login').then((m) => m.LoginComponent),
    title: 'Acceso Administrativo · Cursos Alfa Digital',
  },
  { path: '**', redirectTo: '' },
];
