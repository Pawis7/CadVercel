import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CursosService, CursoApi } from '../../services/cursos';
import { CursoCard } from '../../components/curso-card/curso-card';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink, CursoCard],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos implements OnInit {
  readonly authService = inject(AuthService);
  readonly cursosService = inject(CursosService);
  readonly currentUser = this.authService.currentUser;

  readonly selectedNivel = signal<string>('Todos');
  readonly niveles = ['Todos', 'PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'];
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly coursesList = signal<CursoApi[]>([]);

  readonly nivelLabel: Record<string, string> = {
    Todos: 'Todos',
    PRINCIPIANTE: 'Principiante',
    INTERMEDIO: 'Intermedio',
    AVANZADO: 'Avanzado',
  };

  get isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Los admins ven todos los cursos (incl. borradores), los usuarios solo publicados
    const request$ = this.isAdmin
      ? this.cursosService.getCursosAdmin()
      : this.cursosService.getCursos();

    request$.subscribe({
      next: (cursos) => {
        this.coursesList.set(cursos);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo. Inténtalo de nuevo.');
        this.isLoading.set(false);
      },
    });
  }

  setNivel(nivel: string): void {
    this.selectedNivel.set(nivel);
  }

  get filteredCourses(): CursoApi[] {
    const filter = this.selectedNivel();
    if (filter === 'Todos') return this.coursesList();
    return this.coursesList().filter((c) => c.nivel === filter);
  }

  /** Elimina un curso y recarga la lista (solo ADMIN) */
  onDelete(id: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.')) return;
    this.cursosService.deleteCurso(id).subscribe({
      next: () => {
        // Invalida el cache para que la recarga traiga datos frescos
        this.cursosService.invalidateCache();
        this.loadCursos();
      },
      error: () => alert('Error al eliminar el curso. Inténtalo de nuevo.'),
    });
  }

  /** Navega a la pantalla de edición (solo ADMIN) — pendiente de implementar */
  onEdit(id: string): void {
    // TODO: Navegar a /cursos/editar/:id cuando se implemente la pantalla
    console.log('Editar curso', id);
  }
}
