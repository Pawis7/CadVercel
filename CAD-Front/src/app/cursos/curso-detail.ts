// curso-detail.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COURSES } from '../core/data/special-sections.data';
import { Course } from '../core/models/special-sections.models';
import { ProgressService } from '../core/services/progress.service';

@Component({
  selector: 'app-curso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './curso-detail.html',
})
export class CursoDetailComponent {
  private route = inject(ActivatedRoute);
  protected progress = inject(ProgressService);

  protected slug = signal<string>(this.route.snapshot.paramMap.get('slug') ?? '');
  protected course = computed<Course | undefined>(() =>
    COURSES.find((c) => c.slug === this.slug()));

  protected totalLessons = computed(() =>
    (this.course()?.syllabus ?? []).reduce((n, u) => n + u.lessons.length, 0));

  // Tick para recomputar el % tras togglear (signals no observan localStorage)
  protected tick = signal(0);
  protected percent = computed(() => {
    this.tick();
    return this.progress.courseProgress(this.slug(), this.totalLessons());
  });

  protected lid(u: number, l: number): string { return this.progress.lessonId(u, l); }
  protected done(u: number, l: number): boolean {
    this.tick();
    return this.progress.isLessonDone(this.slug(), this.lid(u, l));
  }
  protected toggle(u: number, l: number): void {
    this.progress.toggleLesson(this.slug(), this.lid(u, l));
    this.tick.update((n) => n + 1);
  }

  protected levelLabel(): string {
    const map = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' } as const;
    const c = this.course();
    return c ? map[c.level] : '';
  }
}
