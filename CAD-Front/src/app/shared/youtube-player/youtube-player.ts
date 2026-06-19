import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { extractYouTubeId, youtubeEmbedUrl, youtubeThumbnail } from '../../core/utils/youtube';

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './youtube-player.html',
  styleUrl: './youtube-player.css',
})
export class YoutubePlayerComponent {
  private sanitizer = inject(DomSanitizer);

  private _url = signal<string>('');
  private _title = signal<string>('Video');
  private _quality = signal<'hq' | 'maxres'>('hq');

  @Input() set url(v: string) { this._url.set(v); }
  @Input() set title(v: string) { this._title.set(v); }
  @Input() set quality(v: 'hq' | 'maxres') { this._quality.set(v); }

  readonly playing = signal(false);

  readonly videoId = computed(() => extractYouTubeId(this._url()));

  readonly thumbnail = computed(() => {
    const id = this.videoId();
    return id ? youtubeThumbnail(id, this._quality()) : '';
  });

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.videoId();
    if (!id) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(id, true));
  });

  readonly displayTitle = computed(() => this._title());

  play() {
    if (this.videoId()) this.playing.set(true);
  }
}
