/**
 * PATCH /api/content/sections/[section]
 * Administra las FeatureCards destacadas de una sección (admin).
 * Recibe un array de cardIds (máximo 3) y actualiza el campo `sections` de todas las cards.
 */
import { NextRequest } from 'next/server';
import { ok, badRequest, serverError } from '@/lib/responses';
import { isAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { section } = await params;
    const body = await req.json();
    const { cardIds } = body;

    if (!Array.isArray(cardIds)) {
      return badRequest('cardIds debe ser un array.');
    }

    if (cardIds.length > 3) {
      return badRequest('No puedes seleccionar más de 3 elementos destacados por sección.');
    }

    // 1. Obtener todas las feature cards
    const allCards = await prisma.featureCard.findMany();

    // 2. Actualizar cada tarjeta en la base de datos
    await Promise.all(
      allCards.map((card) => {
        let newSections = [...card.sections];
        const shouldHave = cardIds.includes(card.id);
        const hasSection = newSections.includes(section);

        if (shouldHave && !hasSection) {
          newSections.push(section);
        } else if (!shouldHave && hasSection) {
          newSections = newSections.filter((s) => s !== section);
        }

        return prisma.featureCard.update({
          where: { id: card.id },
          data: { sections: newSections },
        });
      })
    );

    // Retornar las tarjetas actualizadas
    const updatedCards = await prisma.featureCard.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return ok(updatedCards);
  } catch (err) {
    return serverError(err);
  }
}
