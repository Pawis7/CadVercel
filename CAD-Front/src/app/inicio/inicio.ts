import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { UiIconComponent, UiIconName } from '../shared/ui-icon/ui-icon';
import { COURSES } from '../core/data/special-sections.data';
import { Course } from '../core/models/special-sections.models';
import { CourseCardComponent } from '../shared/course-card/course-card';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, UiIconComponent, CourseCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {
  courses: Course[] = COURSES;

  valueStrip: { title: string; copy: string; icon: UiIconName }[] = [
    { title: 'Rutas guiadas', copy: 'Progresión clara por unidades para aprender sin saltarte pasos.', icon: 'course' },
    { title: 'Aplicación real', copy: 'Contenido pensado para el aula, la familia y la vida digital cotidiana.', icon: 'community' },
    { title: 'Constancia opcional', copy: 'Algunos cursos incluyen reconocimiento descargable al finalizar.', icon: 'check' },
  ];
}
