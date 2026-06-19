/**
 * GET /api/content/feature-cards/destinations
 *
 * Devuelve la lista de destinos válidos que puede seleccionar el admin
 * al crear o editar una Feature Card.
 *
 * Ejemplo de respuesta:
 * [
 *   { key: "series",   label: "Catálogo de Series", href: "/series",  icon: "video_library" },
 *   { key: "cursos",   label: "Cursos",              href: "/cursos",  icon: "menu_book" },
 *   ...
 * ]
 */
import { ok } from '@/lib/responses';
import { CARD_DESTINATIONS } from '@/lib/card-destinations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const destinations = Object.entries(CARD_DESTINATIONS).map(([key, meta]) => ({
    key,
    label: meta.label,
    href:  meta.href,
    icon:  meta.icon,
  }));
  return ok(destinations);
}
