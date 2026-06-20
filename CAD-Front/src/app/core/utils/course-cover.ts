import { Course } from '../models/special-sections.models';

/** Returns compact human-readable counts: 420 → '420', 1300 → '1.3k', 12000 → '12k' */
export function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'k';
  }
  return String(n);
}

export function courseCoverGradient(course: Course): string {
  switch (course.level) {
    case 'basico':     return 'bg-gradient-to-br from-[#E9004C] to-[#ff5b86]';
    case 'intermedio': return 'bg-gradient-to-br from-[#E9004C] to-amber-500';
    case 'avanzado':   return 'bg-gradient-to-br from-amber-500 to-[#E9004C]';
    default:           return 'bg-gradient-to-br from-[#E9004C] to-[#ff5b86]';
  }
}

export function courseCoverIcon(course: Course): string {
  const byAudience: Record<string, string> = {
    kids:     'child_care',
    teens:    'forum',
    families: 'family_home',
    teachers: 'school',
    cdj:      'public',
  };
  return byAudience[course.audience] ?? 'menu_book';
}
