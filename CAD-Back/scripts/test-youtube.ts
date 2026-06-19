/**
 * Prueba rápida del helper de YouTube.
 * Uso: cd CDJ-Back && npx tsx --env-file=.env scripts/test-youtube.ts [playlistUrlOrId]
 */
import { extractPlaylistId, fetchPlaylistItems } from '../src/lib/youtube';

async function main() {
  const arg =
    process.argv[2] ||
    'https://youtube.com/playlist?list=PL6UhGvZdF4uhkptPgZt5UpoFiK1WQyig4';

  const playlistId = extractPlaylistId(arg);
  console.log(`▶ Playlist URL/ID recibido: ${arg}`);
  console.log(`▶ Playlist ID extraído:     ${playlistId}`);
  if (!playlistId) {
    console.error('✖ No se pudo extraer el playlist ID.');
    process.exit(1);
  }

  if (!process.env.YOUTUBE_API_KEY) {
    console.error('✖ Falta YOUTUBE_API_KEY en CDJ-Back/.env');
    process.exit(1);
  }

  console.log('▶ Llamando YouTube Data API v3…\n');
  const items = await fetchPlaylistItems(playlistId);
  console.log(`✓ ${items.length} video(s) encontrados:\n`);
  items.forEach((it, i) => {
    console.log(`${String(i + 1).padStart(2, '0')}. [${it.durationLabel ?? '??:??'}] ${it.title}`);
    console.log(`    https://www.youtube.com/watch?v=${it.videoId}`);
  });
}

main().catch((err) => {
  console.error('✖ Error:', err.message);
  process.exit(1);
});
