import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth';
import { CursosService } from '../../services/cursos';
import { ReelsService, ReelApi } from '../../services/reels';

const BATCH = 12;

function extractYoutubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function formatDuracion(min: number | null): string {
  if (!min) return '';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h} horas`;
}

function generateOpaqueUid(input: string): string {
  if (!input) return 'uid_guest';
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < input.length; i++) {
    ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'uid_' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(array: T[], seedStr: string): T[] {
  if (!array || array.length <= 1) return array;
  const result = [...array];
  const seedNum = hashString(seedStr || 'default_seed');
  const rng = mulberry32(seedNum);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const NIVEL_LABEL: Record<string, string> = {
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
};

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, AfterViewInit, OnDestroy {
  private auth = inject(AuthService);
  private cursosService = inject(CursosService);
  private reelsService = inject(ReelsService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('sentinel') sentinelRef!: ElementRef<HTMLElement>;
  private observer: IntersectionObserver | null = null;
  private isNavigatingLock = false;
  private touchStartY = 0;

  isLoading = signal(true);
  isLoadingReels = signal(true);
  private allCursos = signal<any[]>([]);
  reels = signal<ReelApi[]>([]);
  activeReelIndex = signal<number | null>(null);

  displayedCount = signal(BATCH);

  private getGuestSeed(): string {
    if (typeof localStorage === 'undefined') return 'guest_default';
    let guestSeed = localStorage.getItem('cad_guest_seed');
    if (!guestSeed) {
      guestSeed = 'guest_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('cad_guest_seed', guestSeed);
    }
    return guestSeed;
  }

  readonly userSeed = computed(() => {
    const user = this.auth.currentUser();
    if (user?.id) {
      return generateOpaqueUid(user.id);
    }
    return generateOpaqueUid(this.getGuestSeed());
  });

  readonly enriched = computed(() =>
    this.allCursos().map((c) => {
      const ytId = extractYoutubeId(c.videoIntro);
      
      let porcentaje: number | null = null;
      if (c.inscripciones && c.inscripciones.length > 0) {
        porcentaje = Math.round(c.inscripciones[0].porcentaje);
      }

      return {
        ...c,
        ytId,
        thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (c.portada ?? null),
        duracionLabel: formatDuracion(c.duracionEstimada),
        nivelLabel: NIVEL_LABEL[c.nivel] ?? c.nivel,
        modulosCount: c._count?.modulos ?? 0,
        inscritosCount: c._count?.inscritos ?? 0,
        porcentaje,
        autorNombre: c.autor ? `${c.autor.firstName} ${c.autor.lastName}` : 'Alfa Digital',
      };
    })
  );

  readonly shuffledCursos = computed(() =>
    seededShuffle(this.enriched(), `${this.userSeed()}_cursos`)
  );

  cards = computed(() => this.shuffledCursos().slice(0, this.displayedCount()));
  hasMore = computed(() => this.displayedCount() < this.shuffledCursos().length);

  readonly enrichedReels = computed(() => {
    const list = this.reels().map((r) => {
      const ytId = extractYoutubeId(r.videoUrl);
      const thumbnail = ytId
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : (r.thumbnailUrl ?? null);
      return {
        ...r,
        ytId,
        thumbnail,
      };
    });
    return seededShuffle(list, `${this.userSeed()}_reels`);
  });

  readonly activeReel = computed(() => {
    const idx = this.activeReelIndex();
    if (idx === null) return null;
    const list = this.enrichedReels();
    if (!list.length) return null;
    return list[(idx + list.length) % list.length];
  });

  ngOnInit(): void {
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.allCursos.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    this.reelsService.getReels().subscribe({
      next: (data) => {
        this.reels.set(data);
        this.isLoadingReels.set(false);
      },
      error: () => this.isLoadingReels.set(false),
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && this.hasMore()) {
          this.displayedCount.update((n) => n + BATCH);
        }
      },
      { rootMargin: '200px' }
    );
    if (this.sentinelRef) {
      this.observer.observe(this.sentinelRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.toggleBodyScroll(false);
  }

  ir(id: string): void {
    this.router.navigate(['/cursos', id]);
  }

  abrirReel(reel: any): void {
    const list = this.enrichedReels();
    const idx = list.findIndex((r) => r.id === reel.id);
    this.activeReelIndex.set(idx !== -1 ? idx : 0);
    this.toggleBodyScroll(true);
  }

  cerrarReel(): void {
    this.activeReelIndex.set(null);
    this.toggleBodyScroll(false);
  }

  siguienteReel(): void {
    const idx = this.activeReelIndex();
    const list = this.enrichedReels();
    if (idx !== null && list.length > 0) {
      this.activeReelIndex.set((idx + 1) % list.length);
    }
  }

  anteriorReel(): void {
    const idx = this.activeReelIndex();
    const list = this.enrichedReels();
    if (idx !== null && list.length > 0) {
      this.activeReelIndex.set((idx - 1 + list.length) % list.length);
    }
  }

  private triggerSingleNavigation(direction: 'next' | 'prev'): void {
    if (this.isNavigatingLock) return;
    this.isNavigatingLock = true;

    if (direction === 'next') {
      this.siguienteReel();
    } else {
      this.anteriorReel();
    }

    // Cooldown lock de 800ms para garantizar estrictamente el cambio 1 a 1 en móviles y mouse wheel
    setTimeout(() => {
      this.isNavigatingLock = false;
    }, 800);
  }

  private toggleBodyScroll(lock: boolean): void {
    if (typeof document !== 'undefined') {
      if (lock) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  @HostListener('window:touchstart', ['$event'])
  handleTouchStart(event: TouchEvent): void {
    if (this.activeReelIndex() === null) return;
    if (event.touches && event.touches.length > 0) {
      this.touchStartY = event.touches[0].clientY;
    }
  }

  @HostListener('window:touchend', ['$event'])
  handleTouchEnd(event: TouchEvent): void {
    if (this.activeReelIndex() === null) return;
    if (this.isNavigatingLock) return;

    if (event.changedTouches && event.changedTouches.length > 0) {
      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchEndY - this.touchStartY;

      // Umbral mínimo de deslizamiento (40px)
      if (Math.abs(deltaY) > 40) {
        this.triggerSingleNavigation(deltaY < 0 ? 'next' : 'prev');
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.activeReelIndex() === null) return;
    const key = event.key;
    if (key === 'ArrowDown' || key === 'PageDown' || key === 'ArrowRight') {
      event.preventDefault();
      this.triggerSingleNavigation('next');
    } else if (key === 'ArrowUp' || key === 'PageUp' || key === 'ArrowLeft') {
      event.preventDefault();
      this.triggerSingleNavigation('prev');
    } else if (key === 'Escape') {
      event.preventDefault();
      this.cerrarReel();
    }
  }

  @HostListener('window:wheel', ['$event'])
  handleWheelEvent(event: WheelEvent): void {
    if (this.activeReelIndex() === null) return;
    event.preventDefault();

    if (this.isNavigatingLock) return;

    if (Math.abs(event.deltaY) > 15) {
      this.triggerSingleNavigation(event.deltaY > 0 ? 'next' : 'prev');
    }
  }

  getSafeEmbedUrl(url: string): SafeResourceUrl {
    const ytId = extractYoutubeId(url);
    if (ytId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
