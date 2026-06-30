import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;

  // Featured courses list for the homepage
  readonly featuredCourses = [
    {
      id: '1',
      title: 'Innovación Educativa con Inteligencia Artificial',
      category: 'Tecnología',
      duration: '40 horas',
      level: 'Intermedio',
      badge: 'Popular',
      color: 'from-orange-400 to-orange-600',
      description: 'Aprende a integrar herramientas de inteligencia artificial generativa en tus planeaciones didácticas y evaluaciones diarias.'
    },
    {
      id: '2',
      title: 'Habilidades Digitales para la Docencia',
      category: 'Habilidades Digitales',
      duration: '30 horas',
      level: 'Básico',
      badge: 'Esencial',
      color: 'from-orange-600 to-orange-400',
      description: 'Domina las plataformas clave del estado de Jalisco para la gestión escolar, comunicación grupal y colaboración educativa.'
    },
    {
      id: '3',
      title: 'Metodologías Activas en Entornos de Aprendizaje',
      category: 'Pedagogía',
      duration: '50 horas',
      level: 'Avanzado',
      badge: 'Nuevo',
      color: 'from-orange-400 via-orange-500 to-orange-600',
      description: 'Implementa el aprendizaje basado en proyectos (ABP), gamificación y aula invertida utilizando herramientas digitales interactivas.'
    }
  ];
}
