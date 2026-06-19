/**
 * Extrae el ID de un video de YouTube desde cualquier formato común:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 * - https://www.youtube.com/shorts/ID
 * - ID directo (11 chars)
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'v');
      if (idx >= 0 && parts[idx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[idx + 1])) {
        return parts[idx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeThumbnail(id: string, quality: 'hq' | 'maxres' = 'hq'): string {
  const file = quality === 'maxres' ? 'maxresdefault' : 'hqdefault';
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

export function youtubeEmbedUrl(id: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: '0',              // videos relacionados solo del mismo canal
    modestbranding: '1',   // reduce el branding de YouTube
    playsinline: '1',      // reproduce inline en iOS
    iv_load_policy: '3',   // desactiva anotaciones legacy
    cc_load_policy: '0',   // no carga subtítulos por defecto
    controls: '1',         // controles visibles (se ocultan auto al reproducir sin hover)
    fs: '1',               // permite fullscreen
  });
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
