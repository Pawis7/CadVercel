import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ContentService } from '../core/services/content.service';
import { RevealDirective } from '../shared/scroll-reveal/scroll-reveal.directive';
import { YoutubePlayerComponent } from '../shared/youtube-player/youtube-player';

@Component({
  selector: 'app-recurso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, YoutubePlayerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recurso-detail.html',
})
export class RecursoDetailComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);

  saved = signal(false);

  private slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  /** Encuentra el video y la serie a la que pertenece */
  context = computed(() => {
    const slugVal = this.slug();
    for (const serie of this.content.videoSeries()) {
      const v = serie.videos.find((x) => x.id === slugVal);
      if (v) return { serie, video: v };
    }
    return null;
  });

  related = computed(() => {
    const ctx = this.context();
    if (!ctx) return [];
    return ctx.serie.videos.filter((x) => x.id !== ctx.video.id).slice(0, 4);
  });

  alsoLike = computed(() => {
    const ctx = this.context();
    if (!ctx) return [];
    const others = this.content
      .videoSeries()
      .filter((s) => s.id !== ctx.serie.id)
      .flatMap((s) => s.videos.map((v) => ({ ...v, seriesTitle: s.title, seriesSlug: s.slug, accent: s.accentClass })));
    return others.slice(0, 3);
  });

  ficha = computed(() => {
    const ctx = this.context();
    if (!ctx) return [];
    return [
      { icon: 'category',     label: 'Tipo',                value: 'Video' },
      { icon: 'cake',         label: 'Edad',                value: '8 a 14 años' },
      { icon: 'compass_calibration', label: 'Eje',          value: 'Seguridad y privacidad' },
      { icon: 'schedule',     label: 'Duración',            value: ctx.video.durationLabel ?? '5 min' },
      { icon: 'menu_book',    label: 'Contenido en uso',    value: 'Hogar / Aula' },
      { icon: 'verified',     label: 'Estatus',             value: 'Publicado' },
    ];
  });

  toggleSaved() { this.saved.update((v) => !v); }
}
