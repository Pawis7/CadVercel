/**
 * Destinos válidos para FeatureCards — espejo del enum CardDestination de Prisma.
 *
 * El backend resuelve `destination` → `href`, pero el front también necesita
 * esta tabla para:
 *  - Mostrar el selector en el panel de edición (admin)
 *  - Resolver el href localmente en el mock estático (site-content.ts)
 *  - Mostrar etiquetas legibles en la UI de administración
 *
 * ⚠️  Si agregas un destino nuevo aquí, agrégalo también en:
 *    CDJ-Back/src/lib/card-destinations.ts  (backend)
 *    CDJ-Back/prisma/schema.prisma           (enum CardDestination)
 */
export interface CardDestinationOption {
  key:   string;
  label: string;
  href:  string;
  icon:  string;
}

export const CARD_DESTINATIONS: CardDestinationOption[] = [
  { key: 'series',          label: 'Catálogo de Series',       href: '/series',                  icon: 'video_library'  },
  { key: 'series_edutips',  label: 'Serie: Edutips',           href: '/edutips',                 icon: 'tips_and_updates' },
  { key: 'series_casi',     label: 'Serie: El día que casi',   href: '/series/el-dia-que-casi',  icon: 'star'           },
  { key: 'series_familias', label: 'Serie: Familias',          href: '/series/familias-conectadas', icon: 'family_restroom'},
  { key: 'series_kids',     label: 'Serie: Niños',             href: '/series/kids',             icon: 'child_care'     },
  { key: 'series_teens',    label: 'Serie: Adolescentes',      href: '/series/teens',            icon: 'school'         },
  { key: 'cursos',          label: 'Cursos',                   href: '/cursos',                  icon: 'menu_book'      },
  { key: 'juegos',          label: 'Juegos',                   href: '/juegos',                  icon: 'sports_esports' },
  { key: 'recursos',        label: 'Recursos',                 href: '/recursos',                icon: 'library_books'  },
  { key: 'ayuda',           label: 'Ayuda Digital',            href: '/ayuda',                   icon: 'support'        },
  { key: 'edutips',         label: 'Edutips',                  href: '/edutips',                 icon: 'lightbulb'      },
  { key: 'notebooks_ia',    label: 'Notebooks IA',             href: '/notebooks-ia',            icon: 'psychology'     },
  { key: 'ninas_y_ninos',   label: 'Perfil: Niñas y Niños',   href: '/audiencia/ninas-y-ninos', icon: 'child_friendly' },
  { key: 'adolescentes',    label: 'Perfil: Adolescentes',     href: '/audiencia/adolescentes',  icon: 'face'           },
  { key: 'familias',        label: 'Perfil: Familias',         href: '/audiencia/familias',      icon: 'groups'         },
  { key: 'docentes',        label: 'Perfil: Docentes',         href: '/audiencia/docentes',      icon: 'person_book'    },
  { key: 'quienes_somos',   label: 'Quiénes somos',            href: '/quienes-somos',           icon: 'info'           },
  { key: 'inicio',          label: 'Inicio',                   href: '/',                        icon: 'home'           },
];

/** Resuelve el href a partir de una clave de destino. */
export function resolveDestination(key: string): string {
  return CARD_DESTINATIONS.find((d) => d.key === key)?.href ?? '/';
}

/** Resuelve la etiqueta legible de un destino. */
export function destinationLabel(key: string): string {
  return CARD_DESTINATIONS.find((d) => d.key === key)?.label ?? key;
}
