import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../core/models/special-sections.models';
import { ProgressService } from '../../core/services/progress.service';
import {
  courseCoverGradient,
  courseCoverIcon,
  formatCount,
} from '../../core/utils/course-cover';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-card.html',
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;

  private progress = inject(ProgressService);

  protected readonly levelLabels: Record<string, string> = {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  };

  get coverGradient(): string {
    return courseCoverGradient(this.course);
  }

  get coverIcon(): string {
    return courseCoverIcon(this.course);
  }

  get totalLessons(): number {
    return (this.course.syllabus ?? []).reduce(
      (n, u) => n + u.lessons.length,
      0
    );
  }

  get progressPercent(): number {
    return this.progress.courseProgress(this.course.slug, this.totalLessons);
  }

  get ratingStars(): { type: 'full' | 'half' | 'empty' }[] {
    const r = this.course.rating ?? 0;
    const stars: { type: 'full' | 'half' | 'empty' }[] = [];
    for (let i = 1; i <= 5; i++) {
      if (r >= i) {
        stars.push({ type: 'full' });
      } else if (r >= i - 0.5) {
        stars.push({ type: 'half' });
      } else {
        stars.push({ type: 'empty' });
      }
    }
    return stars;
  }

  formatCount(n: number): string {
    return formatCount(n);
  }
}
