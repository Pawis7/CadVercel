// progress.service.spec.ts
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let svc: ProgressService;
  beforeEach(() => {
    localStorage.clear();
    svc = new ProgressService();
  });

  it('lessonId compone posición unidad.leccion', () => {
    expect(svc.lessonId(0, 2)).toBe('0.2');
  });

  it('toggle marca y desmarca una lección', () => {
    expect(svc.isLessonDone('curso-x', '0.0')).toBe(false);
    svc.toggleLesson('curso-x', '0.0');
    expect(svc.isLessonDone('curso-x', '0.0')).toBe(true);
    svc.toggleLesson('curso-x', '0.0');
    expect(svc.isLessonDone('curso-x', '0.0')).toBe(false);
  });

  it('courseProgress redondea a porcentaje entero', () => {
    svc.toggleLesson('curso-x', '0.0');
    svc.toggleLesson('curso-x', '0.1');
    expect(svc.courseProgress('curso-x', 4)).toBe(50);
    expect(svc.courseProgress('curso-x', 0)).toBe(0);
  });

  it('persiste entre instancias vía localStorage', () => {
    svc.toggleLesson('curso-x', '1.0');
    const otra = new ProgressService();
    expect(otra.isLessonDone('curso-x', '1.0')).toBe(true);
    expect(localStorage.getItem('cad_progress_v1')).toContain('curso-x');
  });
});
