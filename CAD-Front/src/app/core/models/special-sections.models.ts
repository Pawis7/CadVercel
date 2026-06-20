/**
 * Modelos de las secciones especiales: Cursos, Juegos y Notebooks IA.
 * Espejo de los modelos Prisma del backend.
 */
import { AudienceSlug } from './content.models';

export type CourseLevel = 'basico' | 'intermedio' | 'avanzado';

export interface CourseLesson {
  title: string;
  durationMin?: number;
  videoUrl?: string;
}
export interface CourseUnit {
  unit: string;
  lessons: CourseLesson[];
}
export interface CourseMaterial {
  label: string;
  url: string;
  type: 'pdf' | 'video' | 'link' | 'other';
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  audience: AudienceSlug;
  level: CourseLevel;
  durationHours?: number;
  instructor?: string;
  syllabus: CourseUnit[];
  materials: CourseMaterial[];
  tags: string[];
  coverImageUrl?: string;
  certificate: boolean;
  language: string;
  // Marketplace metadata
  rating?: number;        // 0–5, one decimal  e.g. 4.7
  ratingsCount?: number;  // number of ratings  e.g. 1280
  studentsCount?: number; // enrolled students  e.g. 5400
  category?: string;      // human-readable label e.g. 'Seguridad digital'
}

export type GameKind =
  | 'quiz' | 'simulator' | 'card_game' | 'story' | 'puzzle' | 'arcade' | 'embed' | 'external';

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  audience: AudienceSlug;
  ageMin?: number;
  ageMax?: number;
  kind: GameKind;
  embedUrl?: string;
  externalUrl?: string;
  coverImageUrl?: string;
  badges: string[];
  learningGoals: string[];
  durationMinutes?: number;
  difficulty?: number;
}

export type AINotebookKind =
  | 'notebooklm' | 'gemini_gem' | 'chatgpt_gpt' | 'claude_project' | 'other';

export interface AINotebook {
  id: string;
  slug: string;
  title: string;
  description: string;
  audience: AudienceSlug;
  kind: AINotebookKind;
  externalUrl: string;
  topics: string[];
  instructions?: string;
  prerequisites?: string;
  coverImageUrl?: string;
  language: string;
  featured: boolean;
}
