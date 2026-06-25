import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { CursoCard, CursoCardData } from '../../components/curso-card/curso-card';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, CursoCard],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos {
  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;

  readonly selectedNivel = signal<string>('Todos');
  readonly niveles = ['Todos', 'PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'];

  readonly nivelLabel: Record<string, string> = {
    Todos: 'Todos',
    PRINCIPIANTE: 'Principiante',
    INTERMEDIO: 'Intermedio',
    AVANZADO: 'Avanzado'
  };

  readonly coursesList: CursoCardData[] = [
    {
      id: '1',
      nombre: 'Innovación Educativa con Inteligencia Artificial',
      descripcion: 'Aprende a integrar herramientas de IA generativa en tus planeaciones didácticas y evaluaciones diarias.',
      portada: null,
      etiquetas: ['tecnología', 'IA', 'docencia'],
      nivel: 'INTERMEDIO',
      estado: 'PUBLICADO',
      duracionEstimada: 2400, // 40 horas
      autor: { firstName: 'Laura', lastName: 'Martínez' },
      _count: { modulos: 8, inscritos: 312 }
    },
    {
      id: '2',
      nombre: 'Habilidades Digitales para la Docencia del Siglo XXI',
      descripcion: 'Domina las plataformas clave del estado de Jalisco para la gestión escolar y colaboración educativa.',
      portada: null,
      etiquetas: ['habilidades digitales', 'primaria'],
      nivel: 'PRINCIPIANTE',
      estado: 'PUBLICADO',
      duracionEstimada: 1800, // 30 horas
      autor: { firstName: 'Carlos', lastName: 'Herrera' },
      _count: { modulos: 6, inscritos: 540 }
    },
    {
      id: '3',
      nombre: 'Metodologías Activas en Entornos de Aprendizaje',
      descripcion: 'Implementa ABP, gamificación y aula invertida usando herramientas digitales interactivas.',
      portada: null,
      etiquetas: ['pedagogía', 'ABP', 'gamificación'],
      nivel: 'AVANZADO',
      estado: 'PUBLICADO',
      duracionEstimada: 3000, // 50 horas
      autor: { firstName: 'Ana', lastName: 'González' },
      _count: { modulos: 10, inscritos: 178 }
    },
    {
      id: '4',
      nombre: 'Creación de Recursos Multimedia Didácticos',
      descripcion: 'Diseña infografías, videos educativos y podcasts para enriquecer tus lecciones.',
      portada: null,
      etiquetas: ['multimedia', 'diseño', 'secundaria'],
      nivel: 'PRINCIPIANTE',
      estado: 'PUBLICADO',
      duracionEstimada: 1500, // 25 horas
      autor: { firstName: 'Roberto', lastName: 'Sánchez' },
      _count: { modulos: 5, inscritos: 421 }
    },
    {
      id: '5',
      nombre: 'Evaluación Formativa Digital y Retroalimentación',
      descripcion: 'Herramientas tecnológicas para recopilar evidencias y retroalimentar en tiempo real.',
      portada: null,
      etiquetas: ['evaluación', 'formativa'],
      nivel: 'INTERMEDIO',
      estado: 'PUBLICADO',
      duracionEstimada: 2100, // 35 horas
      autor: { firstName: 'Patricia', lastName: 'López' },
      _count: { modulos: 7, inscritos: 263 }
    },
    {
      id: '6',
      nombre: 'Seguridad Digital y Ciudadanía en la Red',
      descripcion: 'Fomenta el uso seguro, crítico y ético del internet en el aula.',
      portada: null,
      etiquetas: ['seguridad', 'ciudadanía digital'],
      nivel: 'PRINCIPIANTE',
      estado: 'PUBLICADO',
      duracionEstimada: 1200, // 20 horas
      autor: { firstName: 'Miguel', lastName: 'Torres' },
      _count: { modulos: 4, inscritos: 389 }
    }
  ];

  setNivel(nivel: string): void {
    this.selectedNivel.set(nivel);
  }

  get filteredCourses(): CursoCardData[] {
    const filter = this.selectedNivel();
    if (filter === 'Todos') return this.coursesList;
    return this.coursesList.filter(c => c.nivel === filter);
  }
}
