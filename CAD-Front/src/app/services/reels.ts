import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface ReelApi {
  id: string;
  titulo: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  autorNombre?: string;
  autorAvatar?: string | null;
  duracion?: number | null;
  orden?: number;
  creadoEn?: string;
}

export const DEFAULT_REELS: ReelApi[] = [
  {
    id: 'reel-1',
    titulo: '🐍 Aprende Python desde Cero: Tu primer script en 60 segundos',
    videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Alfa Digital Tec',
    autorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    duracion: 60,
    orden: 1,
  },
  {
    id: 'reel-2',
    titulo: '⚡ 5 Métodos de Array en JavaScript que debes dominar',
    videoUrl: 'https://www.youtube.com/watch?v=g7T23XyszbU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Dev Jalisco',
    autorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    duracion: 45,
    orden: 2,
  },
  {
    id: 'reel-3',
    titulo: '🤖 Guía de Prompts de Inteligencia Artificial para Programadores',
    videoUrl: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'IA & Futuro',
    autorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    duracion: 50,
    orden: 3,
  },
  {
    id: 'reel-4',
    titulo: '⚛️ React vs Angular: ¿Cuál aprender en 2026?',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Jalisco Tech',
    autorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    duracion: 40,
    orden: 4,
  },
  {
    id: 'reel-5',
    titulo: '🔒 3 Reglas de Ciberseguridad para Proteger tu Software',
    videoUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'CiberSeguridad',
    autorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    duracion: 55,
    orden: 5,
  },
  {
    id: 'reel-6',
    titulo: '🐳 ¿Qué es Docker y por qué cambió el Desarrollo Web?',
    videoUrl: 'https://www.youtube.com/watch?v=zN8yAIs-2K0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Cloud & DevOps',
    autorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    duracion: 60,
    orden: 6,
  },
  {
    id: 'reel-7',
    titulo: '📊 SQL vs NoSQL: ¿Cuándo usar bases de datos relacionales?',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Data Science MX',
    autorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    duracion: 45,
    orden: 7,
  },
  {
    id: 'reel-8',
    titulo: '🐙 Git & GitHub: Flujo de trabajo profesional en 1 minuto',
    videoUrl: 'https://www.youtube.com/watch?v=0pThnRneDjw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Alfa Digital Tec',
    autorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    duracion: 50,
    orden: 8,
  },
  {
    id: 'reel-9',
    titulo: '🎨 CSS Flexbox vs Grid: Guía práctica de maquetación',
    videoUrl: 'https://www.youtube.com/watch?v=VvU2F5tG_Zg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Frontend Masters',
    autorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    duracion: 40,
    orden: 9,
  },
  {
    id: 'reel-10',
    titulo: '🚀 Crea una API REST con Node.js & NestJS en 5 pasos',
    videoUrl: 'https://www.youtube.com/watch?v=F_oOtaxb0L8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    autorNombre: 'Backend Pro',
    autorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    duracion: 55,
    orden: 10,
  },
];

@Injectable({
  providedIn: 'root',
})
export class ReelsService {
  private http = inject(HttpClient);
  private apiUrl = '/api/reels';

  // Cache en memoria: el request HTTP solo se ejecuta una vez por sesión.
  // refCount: false → el buffer de shareReplay persiste aunque no haya
  // suscriptores activos (navegación entre páginas).
  private cache$: Observable<ReelApi[]> | null = null;

  getReels(): Observable<ReelApi[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<ReelApi[]>(this.apiUrl).pipe(
        // Sin catchError: si la API responde 401, el authInterceptor limpia la sesión
        // y redirige al login. Los DEFAULT_REELS solo existen como referencia de estructura.
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.cache$;
  }

  /** Fuerza una recarga limpia (usar tras crear/editar un reel en admin) */
  invalidateCache(): void {
    this.cache$ = null;
  }
}
