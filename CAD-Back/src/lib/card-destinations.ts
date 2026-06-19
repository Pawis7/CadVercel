/**
 * Mapeo canónico de CardDestination (enum de BD) → ruta de la app.
 *
 * Esta es la ÚNICA fuente de verdad de destinos válidos para FeatureCards.
 * El admin solo puede seleccionar de esta lista — nunca escribe rutas manualmente.
 *
 * Para agregar un destino nuevo:
 *  1. Agrega el valor al enum CardDestination en schema.prisma
 *  2. Corre `prisma migrate dev`
 *  3. Agrega la entrada aquí
 *  4. El selector del panel de admin lo mostrará automáticamente
 */

export const CARD_DESTINATIONS: Record<string, { label: string; href: string; icon: string }> = {
  series:          { label: 'Catálogo de Series',       href: '/series',                      icon: 'video_library' },
  series_edutips:  { label: 'Serie: Edutips',           href: '/edutips',                     icon: 'tips_and_updates' },
  series_casi:     { label: 'Serie: El día que casi',   href: '/series/el-dia-que-casi',      icon: 'star' },
  series_familias: { label: 'Serie: Familias',          href: '/series/familias-conectadas',  icon: 'family_restroom' },
  series_kids:     { label: 'Serie: Niños',             href: '/series/kids',                 icon: 'child_care' },
  series_teens:    { label: 'Serie: Adolescentes',      href: '/series/teens',                icon: 'school' },
  cursos:          { label: 'Cursos',                   href: '/cursos',                      icon: 'menu_book' },
  juegos:          { label: 'Juegos',                   href: '/juegos',                      icon: 'sports_esports' },
  recursos:        { label: 'Recursos',                 href: '/recursos',                    icon: 'library_books' },
  ayuda:           { label: 'Ayuda Digital',            href: '/ayuda',                       icon: 'support' },
  edutips:         { label: 'Edutips',                  href: '/edutips',                     icon: 'lightbulb' },
  notebooks_ia:    { label: 'Notebooks IA',             href: '/notebooks-ia',                icon: 'psychology' },
  ninas_y_ninos:   { label: 'Perfil: Niñas y Niños',   href: '/audiencia/ninas-y-ninos',     icon: 'child_friendly' },
  adolescentes:    { label: 'Perfil: Adolescentes',     href: '/audiencia/adolescentes',      icon: 'face' },
  familias:        { label: 'Perfil: Familias',         href: '/audiencia/familias',          icon: 'groups' },
  docentes:        { label: 'Perfil: Docentes',         href: '/audiencia/docentes',          icon: 'person_book' },
  quienes_somos:   { label: 'Quiénes somos',            href: '/quienes-somos',               icon: 'info' },
  inicio:          { label: 'Inicio',                   href: '/',                            icon: 'home' },
};

/** Devuelve el href de un destino dado su clave de enum. */
export function resolveDestination(destination: string): string {
  return CARD_DESTINATIONS[destination]?.href ?? '/';
}
