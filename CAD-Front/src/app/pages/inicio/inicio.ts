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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CursosService } from '../../services/cursos';

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
  private router = inject(Router);

  @ViewChild('sentinel') sentinelRef!: ElementRef<HTMLElement>;
  private observer: IntersectionObserver | null = null;

  isLoading = signal(true);
  private allCursos = signal<any[]>([]);
  displayedCount = signal(BATCH);

  readonly enriched = computed(() =>
    this.allCursos().map((c) => {
      const ytId = extractYoutubeId(c.videoIntro);
      
      // Calcular porcentaje de inscripción
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

  cards = computed(() => this.enriched().slice(0, this.displayedCount()));
  hasMore = computed(() => this.displayedCount() < this.enriched().length);

  ngOnInit(): void {
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.allCursos.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
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
  }

  ir(id: string): void {
    this.router.navigate(['/cursos', id]);
  }
}
