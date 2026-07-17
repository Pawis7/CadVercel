import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Forma exacta en que la API devuelve un curso del catálogo */
export interface CursoApi {
  id: string;
  nombre: string;
  descripcion: string;
  portada: string | null;
  etiquetas: string[];
  nivel: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  estado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
  duracionEstimada: number | null;
  autor: { firstName: string; lastName: string };
  _count: { modulos: number; inscritos: number };
  inscripciones?: { porcentaje: number }[];
}

export interface CreateCursoPayload {
  nombre: string;
  descripcion: string;
  portada?: string;
  etiquetas?: string[];
  nivel?: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  estado?: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
  duracionEstimada?: number;
}

export type UpdateCursoPayload = Partial<CreateCursoPayload>;

export interface OpcionPayload {
  texto: string;
  esCorrecta: boolean;
}

export interface PreguntaPayload {
  texto: string;
  orden: number;
  opciones: OpcionPayload[];
}

export interface LeccionPayload {
  titulo: string;
  tipo: 'VIDEO' | 'LECTURA' | 'ARCHIVO' | 'CUESTIONARIO';
  orden: number;
  esObligatoria?: boolean;
  recursoUrl?: string;
  duracionSeg?: number;
  contenidoHtml?: string;
  nombreArchivo?: string;
  tipoMime?: string;
  calificacionMinima?: number;
  preguntas?: PreguntaPayload[];
}

export interface ModuloPayload {
  titulo: string;
  descripcion?: string;
  orden: number;
  lecciones: LeccionPayload[];
}

export interface EstructuraCursoPayload {
  modulos: ModuloPayload[];
}

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  /** Catálogo público — solo cursos PUBLICADOS */
  getCursos(): Observable<CursoApi[]> {
    return this.http.get<CursoApi[]>(`${this.apiUrl}/cursos`);
  }

  /** Admin — todos los cursos (incluye borradores y archivados) */
  getCursosAdmin(): Observable<CursoApi[]> {
    return this.http.get<CursoApi[]>(`${this.apiUrl}/cursos/admin/all`);
  }

  /** Crea un curso nuevo (solo ADMIN) */
  createCurso(payload: CreateCursoPayload): Observable<CursoApi> {
    return this.http.post<CursoApi>(`${this.apiUrl}/cursos`, payload);
  }

  /** Actualiza un curso (solo ADMIN) */
  updateCurso(id: string, payload: UpdateCursoPayload): Observable<CursoApi> {
    return this.http.put<CursoApi>(`${this.apiUrl}/cursos/${id}`, payload);
  }

  /** Guarda la estructura completa de módulos y lecciones (solo ADMIN) */
  saveEstructura(id: string, payload: EstructuraCursoPayload): Observable<{ message: string; modulos: number; lecciones: number }> {
    return this.http.put<{ message: string; modulos: number; lecciones: number }>(`${this.apiUrl}/cursos/${id}/estructura`, payload);
  }

  /** Elimina un curso (solo ADMIN) */
  deleteCurso(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/cursos/${id}`);
  }

  /** Obtiene detalle completo de un curso con módulos, lecciones y progreso del usuario */
  getCursoDetalle(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cursos/${id}`);
  }

  /** Inscribirse a un curso */
  inscribir(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cursos/${id}/inscribir`, {});
  }

  /** Registrar progreso en una lección */
  registrarProgreso(cursoId: string, leccionId: string, payload: { completada: boolean; calificacion?: number; tiempoVisto?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cursos/${cursoId}/lecciones/${leccionId}/progreso`, payload);
  }

  /**
   * Envía las respuestas del cuestionario para evaluación server-side.
   * El backend compara con `esCorrecta` y devuelve la calificación real.
   */
  evaluarCuestionario(
    cursoId: string,
    leccionId: string,
    respuestas: { preguntaId: string; opcionId: string }[],
  ): Observable<{ calificacion: number; aprobado: boolean; correctas: number; total: number; calificacionMinima: number; inscripcion: any; progreso: any[] }> {
    return this.http.post<any>(`${this.apiUrl}/cursos/${cursoId}/lecciones/${leccionId}/evaluar`, { respuestas });
  }
}
