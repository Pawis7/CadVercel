/**
 * Esquemas Zod compartidos. Cada route handler valida con uno de estos
 * y delega errores a `badRequest()`.
 */
import { z } from 'zod';

export const audienceKey = z.enum([
  'kids', 'teens', 'families', 'teachers', 'help', 'edutips', 'casi', 'cdj',
]);

export const illoScene = z.enum([
  'hero', 'study', 'play', 'connect', 'shield', 'spark', 'compass',
]);

export const slug = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug solo con minúsculas, números y guiones.');

export const url = z.string().url();

// === Resource =============================================================
export const resourceCreate = z.object({
  slug,
  title: z.string().min(2),
  description: z.string().min(2),
  format: z.enum([
    'video_animado','microsidio','audiocuento','guia','checklist','simulador',
    'actividad','tarjeta_imprimible','secuencia_didactica','protocolo','infografia',
  ]),
  audienceSlug: z.string().min(2),
  level: z.enum([
    'preescolar','primaria_baja','primaria_alta','secundaria','preparatoria',
    'gestion_escolar','primera_infancia','ninez','adolescencia_temprana',
    'adolescencia_tardia','todos',
  ]).optional(),
  theme: z.enum([
    'seguridad_y_privacidad','convivencia_digital','bienestar_digital',
    'pensamiento_critico','riesgos_y_enganos','uso_responsable',
    'huella_e_identidad','ciberacoso',
  ]).optional(),
  context: z.enum(['casa','aula','microsidio','todos']).default('todos'),
  durationMinutes: z.number().int().positive().optional(),
  youtubeUrl: url.optional(),
  mediaUrl: url.optional(),
  coverImageUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  howToUse: z.array(z.object({
    label: z.string(), description: z.string(), icon: z.string().optional(),
  })).default([]),
  published: z.boolean().default(true),
});
export const resourceUpdate = resourceCreate.partial();

// === Image override =======================================================
export const imageOverrideUpsert = z.object({
  id: z.string().min(2),
  url: z.string().min(2),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.enum(['png','jpg','jpeg','webp','avif','svg']).optional(),
  sizeBytes: z.number().int().positive().optional(),
});

// === Video YouTube ========================================================
export const videoUpdate = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  youtubeUrl: url.optional(),
  durationLabel: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
});

// === Banner ===============================================================
export const bannerUpdate = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  audience: audienceKey.optional(),
  slot: z.enum([
    'home_hero','home_secondary','audience_hero','audience_cta',
    'edutips_hero','ayuda_hero','custom',
  ]).optional(),
});

// === LearningPath =========================================================
export const learningPathCreate = z.object({
  slug,
  title: z.string().min(2),
  description: z.string().min(2),
  audience: audienceKey,
  level: resourceCreate.shape.level,
  totalDurationMinutes: z.number().int().positive().optional(),
  outcomes: z.array(z.string()).default([]),
  coverImageUrl: z.string().optional(),
  steps: z.array(z.object({
    resourceId: z.string(),
    intro: z.string().optional(),
    sortOrder: z.number().int().default(0),
  })),
});
