import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  MOCK_CURSOS,
  MOCK_VIDEO_INTROS,
  getMockCursoDetalle,
  mockInscripcionResponse,
  mockProgresoResponse,
  mockEvaluarCuestionario,
} from '../mock/mock-data';

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

/**
 * Estado en memoria del curso activo (solo en MOCK mode).
 * Permite simular inscripción y progreso sin backend.
 */
const mockCursoDetalleCache: Record<string, any> = {};

function getMockCursoCache(id: string): any {
  if (!mockCursoDetalleCache[id]) {
    mockCursoDetalleCache[id] = getMockCursoDetalle(id);
  }
  return mockCursoDetalleCache[id];
}

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  /** Catálogo público — solo cursos PUBLICADOS */
  getCursos(): Observable<CursoApi[]> {
    if (environment.mock) {
      // Enriquecer los cursos con videoIntro para que el componente de inicio calcule thumbnails
      const cursosConVideo = MOCK_CURSOS.map((c) => ({
        ...c,
        videoIntro: MOCK_VIDEO_INTROS[c.id] ?? null,
      }));
      return of(cursosConVideo).pipe(delay(400));
    }
    return this.http.get<CursoApi[]>(`${this.apiUrl}/cursos`);
  }

  /** Admin — todos los cursos (incluye borradores y archivados) */
  getCursosAdmin(): Observable<CursoApi[]> {
    if (environment.mock) {
      const cursosConVideo = MOCK_CURSOS.map((c) => ({
        ...c,
        videoIntro: MOCK_VIDEO_INTROS[c.id] ?? null,
      }));
      return of(cursosConVideo).pipe(delay(400));
    }
    return this.http.get<CursoApi[]>(`${this.apiUrl}/cursos/admin/all`);
  }

  /** Crea un curso nuevo (solo ADMIN) */
  createCurso(payload: CreateCursoPayload): Observable<CursoApi> {
    if (environment.mock) {
      const newCurso: CursoApi = {
        id: `mock-curso-new-${Date.now()}`,
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        portada: payload.portada ?? null,
        etiquetas: payload.etiquetas ?? [],
        nivel: payload.nivel ?? 'PRINCIPIANTE',
        estado: payload.estado ?? 'BORRADOR',
        duracionEstimada: payload.duracionEstimada ?? null,
        autor: { firstName: 'Ana', lastName: 'García' },
        _count: { modulos: 0, inscritos: 0 },
      };
      return of(newCurso).pipe(delay(300));
    }
    return this.http.post<CursoApi>(`${this.apiUrl}/cursos`, payload);
  }

  /** Actualiza un curso (solo ADMIN) */
  updateCurso(id: string, payload: UpdateCursoPayload): Observable<CursoApi> {
    if (environment.mock) {
      const base = MOCK_CURSOS.find((c) => c.id === id) ?? MOCK_CURSOS[0];
      return of({ ...base, ...payload } as CursoApi).pipe(delay(300));
    }
    return this.http.put<CursoApi>(`${this.apiUrl}/cursos/${id}`, payload);
  }

  /** Guarda la estructura completa de módulos y lecciones (solo ADMIN) */
  saveEstructura(
    id: string,
    payload: EstructuraCursoPayload
  ): Observable<{ message: string; modulos: number; lecciones: number }> {
    if (environment.mock) {
      const totalLecciones = payload.modulos.reduce((acc, m) => acc + m.lecciones.length, 0);
      return of({ message: 'Estructura guardada (mock)', modulos: payload.modulos.length, lecciones: totalLecciones }).pipe(delay(300));
    }
    return this.http.put<{ message: string; modulos: number; lecciones: number }>(
      `${this.apiUrl}/cursos/${id}/estructura`,
      payload
    );
  }

  /** Elimina un curso (solo ADMIN) */
  deleteCurso(id: string): Observable<{ message: string }> {
    if (environment.mock) {
      return of({ message: 'Curso eliminado (mock)' }).pipe(delay(300));
    }
    return this.http.delete<{ message: string }>(`${this.apiUrl}/cursos/${id}`);
  }

  /** Obtiene detalle completo de un curso con módulos, lecciones y progreso del usuario */
  getCursoDetalle(id: string): Observable<any> {
    if (environment.mock) {
      const detalle = getMockCursoCache(id);
      return of(detalle).pipe(delay(500));
    }
    return this.http.get<any>(`${this.apiUrl}/cursos/${id}`);
  }

  /** Inscribirse a un curso */
  inscribir(id: string): Observable<any> {
    if (environment.mock) {
      const response = mockInscripcionResponse(id);
      // Actualizar caché
      if (mockCursoDetalleCache[id]) {
        mockCursoDetalleCache[id] = {
          ...mockCursoDetalleCache[id],
          miInscripcion: response.inscripcion,
          miProgreso: [],
        };
      }
      return of(response).pipe(delay(400));
    }
    return this.http.post<any>(`${this.apiUrl}/cursos/${id}/inscribir`, {});
  }

  /** Registrar progreso en una lección */
  registrarProgreso(
    cursoId: string,
    leccionId: string,
    payload: { completada: boolean; calificacion?: number; tiempoVisto?: number }
  ): Observable<any> {
    if (environment.mock) {
      const cursoDetalle = getMockCursoCache(cursoId);
      const response = mockProgresoResponse(cursoId, leccionId, cursoDetalle);
      // Actualizar caché
      if (mockCursoDetalleCache[cursoId]) {
        mockCursoDetalleCache[cursoId] = {
          ...mockCursoDetalleCache[cursoId],
          miInscripcion: response.inscripcion,
          miProgreso: response.progreso,
        };
      }
      return of(response).pipe(delay(300));
    }
    return this.http.post<any>(
      `${this.apiUrl}/cursos/${cursoId}/lecciones/${leccionId}/progreso`,
      payload
    );
  }

  /**
   * Envía las respuestas del cuestionario para evaluación.
   * En MOCK mode: califica en el cliente usando los datos de `mock-data.ts`.
   * En producción: el backend compara con `esCorrecta` y devuelve la calificación real.
   */
  evaluarCuestionario(
    cursoId: string,
    leccionId: string,
    respuestas: { preguntaId: string; opcionId: string }[]
  ): Observable<{
    calificacion: number;
    aprobado: boolean;
    correctas: number;
    total: number;
    calificacionMinima: number;
    inscripcion: any;
    progreso: any[];
  }> {
    if (environment.mock) {
      const cursoDetalle = getMockCursoCache(cursoId);
      // Encontrar la lección del cuestionario
      let leccion: any = null;
      for (const modulo of cursoDetalle?.modulos ?? []) {
        const found = (modulo.lecciones ?? []).find((l: any) => l.id === leccionId);
        if (found) { leccion = found; break; }
      }

      const result = mockEvaluarCuestionario(leccion, respuestas, cursoDetalle, leccionId);

      // Actualizar caché
      if (mockCursoDetalleCache[cursoId]) {
        mockCursoDetalleCache[cursoId] = {
          ...mockCursoDetalleCache[cursoId],
          miInscripcion: result.inscripcion,
          miProgreso: result.progreso,
        };
      }

      return of(result).pipe(delay(400));
    }

    return this.http.post<any>(
      `${this.apiUrl}/cursos/${cursoId}/lecciones/${leccionId}/evaluar`,
      { respuestas }
    );
  }
}
