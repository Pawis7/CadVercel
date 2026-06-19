import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { COURSES } from '../core/data/special-sections.data';
import { Course, CourseLevel } from '../core/models/special-sections.models';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { UiIconComponent, UiIconName } from '../shared/ui-icon/ui-icon';
import { ProgressService } from '../core/services/progress.service';
import { courseCoverGradient, courseCoverIcon } from '../core/utils/course-cover';

type SortKey = 'popular' | 'recent' | 'duration_asc' | 'duration_desc';
type DurationKey = 'todos' | 'corto' | 'medio' | 'largo';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RevealDirective, UiIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cursos.html',
})
export class CursosComponent {
  protected progress = inject(ProgressService);
  protected courses = signal<Course[]>(COURSES);

  protected query = signal<string>('');
  protected levelFilter = signal<CourseLevel | 'todos'>('todos');
  protected audienceFilter = signal<string>('todos');
  protected onlyCertificate = signal<boolean>(false);
  protected durationFilter = signal<DurationKey>('todos');
  protected sort = signal<SortKey>('popular');

  protected levels: { id: CourseLevel | 'todos'; label: string }[] = [
    { id: 'todos',      label: 'Todos los niveles' },
    { id: 'basico',     label: 'Básico' },
    { id: 'intermedio', label: 'Intermedio' },
    { id: 'avanzado',   label: 'Avanzado' },
  ];

  protected audienceOptions: { id: string; label: string; dot?: boolean }[] = [
    { id: 'todos',    label: 'Todas las audiencias' },
    { id: 'cdj',      label: 'General',      dot: true },
    { id: 'kids',     label: 'Niñas y niños', dot: true },
    { id: 'teens',    label: 'Adolescentes', dot: true },
    { id: 'families', label: 'Familias',     dot: true },
    { id: 'teachers', label: 'Docentes',     dot: true },
  ];

  protected durations: { id: DurationKey; label: string }[] = [
    { id: 'todos', label: 'Cualquier duración' },
    { id: 'corto', label: 'Corto (≤ 3h)' },
    { id: 'medio', label: 'Medio (3–6h)' },
    { id: 'largo', label: 'Largo (> 6h)' },
  ];

  protected levelLabels: Record<CourseLevel, string> = {
    basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado',
  };

  protected featuredMoments: { title: string; copy: string; icon: UiIconName }[] = [
    { title: 'Rutas guiadas', copy: 'Programas con una progresión clara para no aprender a saltos.', icon: 'course' },
    { title: 'Aplicación real', copy: 'Contenido pensado para escuela, familia y vida digital cotidiana.', icon: 'community' },
    { title: 'Constancia opcional', copy: 'Algunos cursos incluyen reconocimiento al finalizar.', icon: 'check' },
  ];

  protected filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const lvl = this.levelFilter();
    const aud = this.audienceFilter();
    const cert = this.onlyCertificate();
    const dur = this.durationFilter();
    const sort = this.sort();

    let list = this.courses().filter((c) => {
      if (lvl !== 'todos' && c.level !== lvl) return false;
      if (aud !== 'todos' && c.audience !== aud) return false;
      if (cert && !c.certificate) return false;
      if (q) {
        const hay = (c.title + ' ' + c.shortDescription + ' ' + (c.tags ?? []).join(' ') + ' ' + (c.instructor ?? '')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (dur !== 'todos') {
        const h = c.durationHours ?? 0;
        if (dur === 'corto' && h > 3) return false;
        if (dur === 'medio' && (h <= 3 || h > 6)) return false;
        if (dur === 'largo' && h <= 6) return false;
      }
      return true;
    });

    if (sort === 'duration_asc')  list = [...list].sort((a, b) => (a.durationHours ?? 0) - (b.durationHours ?? 0));
    if (sort === 'duration_desc') list = [...list].sort((a, b) => (b.durationHours ?? 0) - (a.durationHours ?? 0));

    return list;
  });

  protected resetFilters() {
    this.query.set('');
    this.levelFilter.set('todos');
    this.audienceFilter.set('todos');
    this.onlyCertificate.set(false);
    this.durationFilter.set('todos');
    this.sort.set('popular');
  }

  protected audienceLabel(aud: string): string {
    const map: Record<string, string> = {
      kids: 'Niñas y niños', teens: 'Adolescentes', families: 'Familias',
      teachers: 'Docentes', cdj: 'General', help: 'Ayuda', edutips: 'Edutips',
    };
    return map[aud] ?? 'General';
  }

  protected audienceIcon(aud: string): string {
    const map: Record<string, string> = {
      kids: 'child_care', teens: 'forum', families: 'family_restroom',
      teachers: 'school', cdj: 'public', help: 'shield', edutips: 'play_circle',
    };
    return map[aud] ?? 'public';
  }

  protected coursePercent(c: Course): number {
    const total = (c.syllabus ?? []).reduce((n, u) => n + u.lessons.length, 0);
    return this.progress.courseProgress(c.slug, total);
  }

  protected coverGradient(c: Course): string { return courseCoverGradient(c); }
  protected coverIcon(c: Course): string { return courseCoverIcon(c); }
}
