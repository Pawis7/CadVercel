// progress.service.ts
import { Injectable } from '@angular/core';

const KEY = 'cad_progress_v1';
type Store = Record<string, string[]>;

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private read(): Store {
    if (typeof localStorage === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store; } catch { return {}; }
  }
  private write(s: Store): void {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }

  lessonId(unitIndex: number, lessonIndex: number): string {
    return `${unitIndex}.${lessonIndex}`;
  }
  isLessonDone(slug: string, lessonId: string): boolean {
    return (this.read()[slug] ?? []).includes(lessonId);
  }
  toggleLesson(slug: string, lessonId: string): void {
    const store = this.read();
    const done = new Set(store[slug] ?? []);
    done.has(lessonId) ? done.delete(lessonId) : done.add(lessonId);
    store[slug] = [...done];
    this.write(store);
  }
  completedCount(slug: string): number {
    return (this.read()[slug] ?? []).length;
  }
  courseProgress(slug: string, totalLessons: number): number {
    if (totalLessons <= 0) return 0;
    return Math.round((this.completedCount(slug) / totalLessons) * 100);
  }
}
