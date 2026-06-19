/**
 * GET /api/content/site
 *
 * Devuelve el bundle completo de contenido editable que necesita CDJ-Front
 * para pintar el shell + el home. Pensado para una sola llamada al boot.
 *
 * Forma de respuesta:
 *   {
 *     branding, hero, pillars, secondaryBanner,
 *     categories, featureCards, videoSeries,
 *     navSections, socialLinks, footerColumns,
 *     imageOverrides
 *   }
 */
import { ok, serverError } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      branding, hero, pillars, banners,
      audiences, featureCards, videoSeries,
      socialLinks, footerColumns,
      imageOverrides,
    ] = await Promise.all([
      prisma.siteBranding.findUnique({ where: { id: 1 } }),
      prisma.heroBlock.findUnique({ where: { id: 1 } }),
      prisma.pillar.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.audience.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          subLevels: { orderBy: { sortOrder: 'asc' } },
          topics: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      prisma.featureCard.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.videoSeries.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { videos: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.footerColumn.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { links: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.imageOverride.findMany(),
    ]);

    const overridesMap: Record<string, string> = {};
    for (const o of imageOverrides) overridesMap[o.id] = o.url;

    return ok({
      branding,
      hero,
      pillars,
      categories: audiences,
      featureCards,
      videoSeries,
      secondaryBanner: banners.find((b) => b.slot === 'home_secondary') ?? null,
      banners,
      socialLinks,
      footerColumns,
      imageOverrides: overridesMap,
    });
  } catch (err) {
    return serverError(err);
  }
}
