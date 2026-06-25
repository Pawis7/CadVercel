import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface CursoCardData {
  id: string;
  nombre: string;
  descripcion: string;
  portada?: string | null;
  etiquetas: string[];
  nivel: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  estado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
  duracionEstimada?: number | null; // minutos
  autor: { firstName: string; lastName: string };
  _count?: { modulos?: number; inscritos?: number };
}

@Component({
  selector: 'app-curso-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './curso-card.html',
  styleUrl: './curso-card.css',
  host: { class: 'block h-full' }
})
export class CursoCard {
  @Input({ required: true }) curso!: CursoCardData;

  get nivelLabel(): string {
    const map: Record<string, string> = {
      PRINCIPIANTE: 'Principiante',
      INTERMEDIO: 'Intermedio',
      AVANZADO: 'Avanzado'
    };
    return map[this.curso.nivel] ?? this.curso.nivel;
  }

  get nivelClasses(): string {
    const map: Record<string, string> = {
      PRINCIPIANTE: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40',
      INTERMEDIO:   'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40',
      AVANZADO:     'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40'
    };
    return map[this.curso.nivel] ?? '';
  }

  get duracionLabel(): string {
    const min = this.curso.duracionEstimada;
    if (!min) return '';
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h} horas`;
  }

  get autorNombre(): string {
    return `${this.curso.autor.firstName} ${this.curso.autor.lastName}`;
  }

  get modulosCount(): number {
    return this.curso._count?.modulos ?? 0;
  }

  get inscritosCount(): number {
    return this.curso._count?.inscritos ?? 0;
  }
}
