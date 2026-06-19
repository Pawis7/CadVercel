import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ContentService } from '../../core/services/content.service';
import { ApiClient } from '../../core/services/api.client';
import { RevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';
import { YoutubePlayerComponent } from '../../shared/youtube-player/youtube-player';
import { EditableImageComponent } from '../../shared/editable-image/editable-image';
import { ImageEditService } from '../../core/services/image-edit.service';
import { AuthService } from '../../core/services/auth.service';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card';
import { VideoModalComponent } from '../../shared/video-modal/video-modal';

interface SyncResult {
  added: number;
  skipped: number;
  total: number;
  playlistId: string;
  syncedAt: string;
}

@Component({
  selector: 'app-series-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RevealDirective, YoutubePlayerComponent, EditableImageComponent, FeatureCardComponent, VideoModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './series-detail.html',
})
export class SeriesDetailComponent {
  private route   = inject(ActivatedRoute);
  private content = inject(ContentService);
  private imgEdit = inject(ImageEditService);
  private auth    = inject(AuthService);
  private api     = inject(ApiClient);

  /** editMode del hero cover también requiere login — isEditActive ya lo garantiza */
  editMode = this.imgEdit.isEditActive;

  hasOverride(id: string): boolean { return !!this.imgEdit.getOverride(id); }
  async resetOverride(id: string) {
    try {
      await this.imgEdit.deleteOverride(id);
      await this.content.refreshFromBackend();
    } catch (err) {
      console.error('Error al restablecer la portada:', err);
    }
  }

  async onFileSelected(event: Event, id: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      await this.imgEdit.uploadImage(id, file);
      await this.content.refreshFromBackend();
    } catch (err) {
      console.error('Error al subir la portada:', err);
      alert('Error al subir la imagen.');
    } finally {
      input.value = '';
    }
  }

  private slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  serie  = computed(() => this.content.getSeriesBySlug(this.slug()));
  videos = computed(() => this.serie()?.videos ?? []);

  /** Video activo para el modal emergente */
  activeVideo = signal<any>(null);

  /** Extrae la URL del thumbnail de alta calidad de YouTube */
  getYoutubeThumb(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|\/watch\?v=))([\w-]{11})/);
    const vid = match ? match[1] : '';
    return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }

  /** Otras series como FeatureCard para usar app-feature-card */
  relatedCards = computed(() => {
    const current = this.serie();
    if (!current) return [];
    return this.content
      .videoSeries()
      .filter((s) => s.id !== current.id)
      .slice(0, 3)
      .map((s) => this.content.seriesAsCard(s));
  });

  // ─── Sync de Playlist de YouTube (admin) ──────────────────────────────────
  /** Input controlado del URL de la playlist en el panel admin. */
  playlistInput = signal<string>('');
  /** Estado de la última sincronización. */
  syncing       = signal(false);
  syncError     = signal<string | null>(null);
  syncResult    = signal<SyncResult | null>(null);

  constructor() {
    // Precarga el input con el playlistId guardado de la serie cuando cambia
    effect(() => {
      const s = this.serie();
      const current = this.playlistInput();
      const saved = s?.youtubePlaylistId ?? '';
      // Solo precarga si el usuario no ha empezado a escribir
      if (!current && saved) {
        const url = saved.startsWith('http')
          ? saved
          : `https://www.youtube.com/playlist?list=${saved}`;
        this.playlistInput.set(url);
      }
    });
  }

  async syncPlaylist() {
    const s = this.serie();
    if (!s) return;
    const input = this.playlistInput().trim();
    if (!input && !s.youtubePlaylistId) {
      this.syncError.set('Pega un URL o ID de playlist primero.');
      return;
    }
    this.syncing.set(true);
    this.syncError.set(null);
    this.syncResult.set(null);
    try {
      const res = await this.api.post<SyncResult>(
        `/content/series/${s.id}/sync-playlist`,
        input ? { playlistUrl: input } : {},
      );
      this.syncResult.set(res);
      await this.content.refreshFromBackend();
    } catch (err: any) {
      this.syncError.set(err?.message ?? 'Error al sincronizar.');
    } finally {
      this.syncing.set(false);
    }
  }
}
