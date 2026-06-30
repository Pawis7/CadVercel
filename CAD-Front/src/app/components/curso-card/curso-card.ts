import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
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
  inscripciones?: { porcentaje: number }[];
}

@Component({
  selector: 'app-curso-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './curso-card.html',
  styleUrl: './curso-card.css',
  host: { class: 'block w-full h-full' }
})
export class CursoCard {
  @Input({ required: true }) curso!: CursoCardData;
  /** Activa el menú de 3 puntos con opciones de editar y eliminar */
  @Input() isAdmin = false;

  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  /** Estado del menú de opciones admin */
  readonly isMenuOpen = signal<boolean>(false);

  toggleMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  edit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeMenu();
    this.onEdit.emit(this.curso.id);
  }

  delete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeMenu();
    this.onDelete.emit(this.curso.id);
  }

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

  get estadoClasses(): string {
    const map: Record<string, string> = {
      BORRADOR:   'bg-slate-100 text-slate-500 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
      PUBLICADO:  'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40',
      ARCHIVADO:  'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40',
    };
    return map[this.curso.estado] ?? '';
  }

  get estadoLabel(): string {
    const map: Record<string, string> = {
      BORRADOR:  'Borrador',
      PUBLICADO: 'Publicado',
      ARCHIVADO: 'Archivado',
    };
    return map[this.curso.estado] ?? this.curso.estado;
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

  get porcentaje(): number | null {
    if (this.curso.inscripciones && this.curso.inscripciones.length > 0) {
      return Math.round(this.curso.inscripciones[0].porcentaje);
    }
    return null;
  }
}
