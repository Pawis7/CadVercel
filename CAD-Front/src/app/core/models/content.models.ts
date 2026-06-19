export interface SiteBranding {
  logoText: { line1: string; line2: string };
  logoGradientFrom: string;
  logoGradientVia: string;
  logoGradientTo: string;
  siteName: string;
  tagline: string;
}

export interface Hero {
  eyebrow?: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
}

export type AudienceSlug = 'kids' | 'teens' | 'families' | 'teachers' | 'help' | 'edutips' | 'casi' | 'cdj';

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
  accentColor?: string;
  audience?: AudienceSlug;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl: string;
  accent: string;
  audience: AudienceSlug;
  illoScene?: 'hero' | 'study' | 'play' | 'connect' | 'shield' | 'spark' | 'compass';
  ageRange?: string;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgClass: string;
  shadowClass: string;
}

export interface FeatureCard {
  id:              string;
  title:           string;
  description:     string;
  icon:            string;
  iconBgClass:     string;
  iconShadowClass: string;
  imageUrl:        string;
  /** Clave del enum CardDestination — se resuelve a href por resolveDestination() */
  destination?:    string;
  /** href resuelto (lo añade el backend o ContentService al hidratar) */
  href:            string;
  audience:        AudienceSlug;
  illoScene?:      'hero' | 'study' | 'play' | 'connect' | 'shield' | 'spark' | 'compass';
  badge?:          string;
  sections?:       string[];
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  durationLabel?: string;
  publishedAt?: string;
  tags?: string[];
  /** Canal/autor que publica el video. */
  author?: string;
  /** Handle del canal en YouTube (@usuario). */
  authorHandle?: string;
  /** URL al canal de YouTube (para el botón "ver canal"). */
  authorUrl?: string;
}

export interface VideoSeries {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  accentClass: string;
  iconBgClass: string;
  icon: string;
  episodeCount: number;
  videos: VideoItem[];
  audience: AudienceSlug;
  illoScene?: 'hero' | 'study' | 'play' | 'connect' | 'shield' | 'spark' | 'compass';
  /** ID de playlist de YouTube asociada (admin sync). */
  youtubePlaylistId?: string | null;
  /** Última vez que el admin sincronizó la playlist. */
  lastSyncedAt?: string | null;
}

export interface NavSection {
  id: string;
  title: string;
  icon: string;
  bgClass: string;
  textClass: string;
  expanded: boolean;
  items: { label: string; href: string }[];
}

export type SocialBrand =
  | 'facebook' | 'instagram' | 'youtube' | 'x' | 'tiktok'
  | 'whatsapp' | 'threads' | 'linkedin' | 'spotify';

export interface SocialLink {
  id: string;
  brand: SocialBrand;
  label: string;
  href: string;
  hoverClass: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}
