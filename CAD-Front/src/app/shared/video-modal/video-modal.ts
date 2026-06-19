import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { extractYouTubeId, youtubeEmbedUrl, youtubeThumbnail } from '../../core/utils/youtube';

export interface VideoModalData {
  youtubeUrl: string;
  title:      string;
  description?: string;
  durationLabel?: string;
  tags?: string[];
  /** Nombre de la colección: serie, edutip, etc. */
  seriesTitle?: string;
  /** Canal/autor del video. */
  author?: string;
  /** URL del canal en YouTube. */
  authorUrl?: string;
  /** Fecha de publicación (ISO o legible). */
  publishedAt?: string;
}

/**
 * Modal premium global para reproducir videos de YouTube.
 *
 * Uso:
 *   <app-video-modal [video]="activeVideo()" (close)="activeVideo.set(null)" />
 *
 * El host debe controlar la visibilidad mediante un @if(activeVideo()).
 */
@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-modal.html',
  styleUrl: './video-modal.css',
})
export class VideoModalComponent implements OnInit, OnDestroy {
  @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;
  @ViewChild('meta') metaRef!: ElementRef<HTMLElement>;

  private sanitizer = inject(DomSanitizer);
  private document = inject(DOCUMENT);

  private _video = signal<VideoModalData | null>(null);
  @Input({ required: true }) set video(v: VideoModalData | null) { this._video.set(v); }

  close = output<void>();

  ngOnInit() {
    this.document.body.classList.add('no-scroll');
  }

  // Usamos listeners manuales para asegurar que NO sean pasivos en móvil
  private cleanupListeners: (() => void)[] = [];

  ngAfterViewInit() {
    if (window.innerWidth < 640 && this.panelRef) {
      const el = this.panelRef.nativeElement;
      const ts = (e: TouchEvent) => this.onTouchStart(e);
      const tm = (e: TouchEvent) => this.onTouchMove(e);
      const te = (e: TouchEvent) => this.onTouchEnd(e);

      el.addEventListener('touchstart', ts as any, { passive: true });
      el.addEventListener('touchmove', tm as any, { passive: false });
      el.addEventListener('touchend', te as any, { passive: true });

      this.cleanupListeners.push(() => {
        el.removeEventListener('touchstart', ts as any);
        el.removeEventListener('touchmove', tm as any);
        el.removeEventListener('touchend', te as any);
      });
    }
  }

  ngOnDestroy() {
    this.document.body.classList.remove('no-scroll');
    this.cleanupListeners.forEach(fn => fn());
  }

  readonly videoId = computed(() => {
    const url = this._video()?.youtubeUrl ?? '';
    return extractYouTubeId(url);
  });

  readonly thumbnail = computed(() => {
    const id = this.videoId();
    return id ? youtubeThumbnail(id, 'maxres') : '';
  });

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.videoId();
    if (!id) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(id, true));
  });

  readonly data = computed(() => this._video());

  /** true mientras se reproduce la animación de salida en móvil */
  closing = signal(false);

  // --- Lógica de Swipe-to-Close (Móvil) ---
  private startY = 0;
  private isDragging = false;
  private currentY = 0;

  onTouchStart(e: TouchEvent) {
    const metaEl = this.metaRef?.nativeElement;
    
    // Si el usuario está scrolleando dentro de los metadatos y no está arriba del todo, cancelamos el drag
    if (metaEl && metaEl.contains(e.target as Node) && metaEl.scrollTop > 0) {
      this.isDragging = false;
      return;
    }
    
    this.startY = e.touches[0].clientY;
    this.currentY = this.startY;
    this.isDragging = true;
    
    const panel = this.panelRef.nativeElement;
    panel.style.transition = 'none'; 
    panel.style.animation = 'none'; // Desactivar la animación inicial de entrada para que no interfiera
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    
    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.startY;
    const panel = this.panelRef.nativeElement;
    const metaEl = this.metaRef?.nativeElement;

    // Detectar si el toque se originó en la zona de metadatos (el texto scrolleable)
    const touchOnMeta = metaEl && metaEl.contains(e.target as Node);

    if (touchOnMeta) {
      // 1. Si el usuario intenta hacer scroll hacia arriba (deltaY negativo),
      //    le damos prioridad al scroll interno y cancelamos el drag del modal.
      if (deltaY < -5) {
        this.isDragging = false;
        panel.style.transform = 'translate3d(0, 0, 0)';
        return;
      }
      
      // 2. Si intenta arrastrar hacia abajo (deltaY positivo) pero el texto no está al principio (scrollTop > 0),
      //    le damos prioridad al scroll interno y cancelamos el drag del modal.
      if (deltaY > 5 && metaEl.scrollTop > 0) {
        this.isDragging = false;
        panel.style.transform = 'translate3d(0, 0, 0)';
        return;
      }
    }

    // Si llegamos aquí, el movimiento es un arrastre válido del modal
    if (deltaY > 0) {
      if (e.cancelable) e.preventDefault();
      // Usamos translate3d para forzar aceleración por hardware
      panel.style.transform = `translate3d(0, ${deltaY}px, 0)`;
    } else {
      // Hacia arriba con resistencia
      const resistance = 0.3;
      const elasticY = deltaY * resistance;
      panel.style.transform = `translate3d(0, ${elasticY}px, 0)`;
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.isDragging) {
      // Asegurarse de limpiar cualquier transformación si el drag se canceló
      const panel = this.panelRef.nativeElement;
      if (panel.style.transform && panel.style.transform !== 'translate3d(0px, 0px, 0px)') {
        panel.style.transition = 'transform 0.3s ease-out';
        panel.style.transform = 'translate3d(0, 0, 0)';
      }
      return;
    }
    this.isDragging = false;

    const currentDeltaY = this.currentY - this.startY;
    const panel = this.panelRef.nativeElement;

    const threshold = window.innerHeight * 0.15;

    if (currentDeltaY > threshold) {
      panel.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 1, 1)';
      panel.style.transform = 'translate3d(0, 100%, 0)';
      
      this.closing.set(true);
      setTimeout(() => {
        this.closing.set(false);
        this.close.emit();
      }, 250);
    } else {
      panel.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      panel.style.transform = 'translate3d(0, 0, 0)';
      
      setTimeout(() => {
        if (!this.isDragging) {
          panel.style.transform = '';
          panel.style.transition = '';
        }
      }, 400);
    }
  }

  onBackdropClick() {
    if (window.innerWidth < 640) {
      this.closing.set(true);
      setTimeout(() => {
        this.closing.set(false);
        this.close.emit();
      }, 280);
    } else {
      this.close.emit();
    }
  }

  onPanelClick(e: Event) { e.stopPropagation(); }
}
