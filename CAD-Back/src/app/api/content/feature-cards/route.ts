/**
 * GET    /api/content/feature-cards            — lista todas las feature cards
 * POST   /api/content/feature-cards            — crea una nueva (admin)
 * GET    /api/content/feature-cards/destinations — opciones válidas de destino
 */
import { NextRequest } from 'next/server';
import { ok, created, badRequest, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CARD_DESTINATIONS, resolveDestination } from '@/lib/card-destinations';

export const dynamic = 'force-dynamic';

/** Enriquece la card de BD añadiendo el href resuelto y las opciones de UI. */
function enrichCard(card: Awaited<ReturnType<typeof prisma.featureCard.findFirstOrThrow>>) {
  return {
    ...card,
    href: resolveDestination(card.destination),
  };
}

export async function GET() {
  try {
    const cards = await prisma.featureCard.findMany({ orderBy: { sortOrder: 'asc' } });
    return ok(cards.map(enrichCard));
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json();

    // Validar destination (debe ser una clave conocida)
    if (!body?.destination || !CARD_DESTINATIONS[body.destination]) {
      return badRequest(`Destino inválido. Opciones válidas: ${Object.keys(CARD_DESTINATIONS).join(', ')}`);
    }
    if (!body?.title?.trim()) return badRequest('El título es obligatorio.');

    const maxOrder = await prisma.featureCard.aggregate({ _max: { sortOrder: true } });
    const nextOrder = (maxOrder._max.sortOrder ?? 0) + 1;

    const card = await prisma.featureCard.create({
      data: {
        title:       body.title.trim(),
        description: body.description?.trim() ?? '',
        imageUrl:    body.imageUrl?.trim() ?? '',
        destination: body.destination,
        audience:    body.audience ?? 'cdj',
        illoScene:   body.illoScene ?? null,
        badge:       body.badge?.trim() ?? null,
        icon:        body.icon ?? 'play_arrow',
        iconBgClass: body.iconBgClass ?? 'bg-amber-600',
        iconShadowClass: body.iconShadowClass ?? 'shadow-amber-200',
        sortOrder:   nextOrder,
      },
    });
    return created(enrichCard(card));
  } catch (err) {
    return serverError(err);
  }
}
