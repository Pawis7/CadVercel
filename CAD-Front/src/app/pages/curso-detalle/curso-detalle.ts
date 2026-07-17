import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CursosService } from '../../services/cursos';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './curso-detalle.html',
})
export class CursoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursosService = inject(CursosService);
  private sanitizer = inject(DomSanitizer);

  isLoading = signal(true);
  error = signal<string | null>(null);
  curso = signal<any | null>(null);

  moduloActivo = signal<any | null>(null);
  leccionActiva = signal<any | null>(null);

  // Cuestionario state
  respuestasQuiz = signal<{ [preguntaId: string]: string }>({});
  quizResultado = signal<{ calificacion: number; aprobado: boolean } | null>(null);
  preguntaActivaIndex = signal<number>(0);
  preguntasMarcadas = signal<{ [preguntaId: string]: boolean }>({});

  respondidasCount = computed(() => {
    return Object.keys(this.respuestasQuiz()).length;
  });

  porResponderCount = computed(() => {
    const l = this.leccionActiva();
    if (!l || !l.preguntas) return 0;
    return l.preguntas.length - this.respondidasCount();
  });

  /** Índice de la primera pregunta sin responder (-1 si todas están respondidas) */
  primeraPreguntaSinResponderIdx = computed(() => {
    const l = this.leccionActiva();
    if (!l || !l.preguntas) return -1;
    const respuestas = this.respuestasQuiz();
    return l.preguntas.findIndex((p: any) => !respuestas[p.id]);
  });

  progresoQuizPercent = computed(() => {
    const l = this.leccionActiva();
    if (!l || !l.preguntas || l.preguntas.length === 0) return 0;
    return Math.round((this.respondidasCount() / l.preguntas.length) * 100);
  });

  porcentajeProgreso = computed(() => {
    const c = this.curso();
    if (!c || !c.miInscripcion) return 0;
    return Math.round(c.miInscripcion.porcentaje || 0);
  });

  totalLeccionesCount = computed(() => {
    const c = this.curso();
    if (!c || !c.modulos) return 0;
    return c.modulos.reduce((acc: number, mod: any) => acc + (mod.lecciones?.length || 0), 0);
  });

  completadasCount = computed(() => {
    const c = this.curso();
    if (!c || !c.miProgreso) return 0;
    return c.miProgreso.filter((p: any) => p.completada).length;
  });

  estaInscrito = computed(() => {
    return !!this.curso()?.miInscripcion;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCurso(id);
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  loadCurso(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.cursosService.getCursoDetalle(id).subscribe({
      next: (data) => {
        this.curso.set(data);
        this.isLoading.set(false);

        // Si hay módulos y lecciones, seleccionar por defecto la primera lección no completada o la primera de todas
        if (data.modulos?.length > 0) {
          let foundModulo = data.modulos[0];
          let foundLeccion = foundModulo.lecciones?.[0];

          if (data.miProgreso?.length > 0) {
            for (const m of data.modulos) {
              for (const l of m.lecciones || []) {
                const prog = data.miProgreso.find((p: any) => p.leccionId === l.id);
                if (!prog || !prog.completada) {
                  foundModulo = m;
                  foundLeccion = l;
                  break;
                }
              }
              if (foundLeccion && !this.esLeccionCompletadaData(foundLeccion.id, data.miProgreso)) break;
            }
          }

          this.seleccionarLeccion(foundModulo, foundLeccion);
        }
      },
      error: (err) => {
        console.error('Error cargando curso:', err);
        this.error.set('No se pudo cargar la información del curso.');
        this.isLoading.set(false);
      },
    });
  }

  inscribirme(): void {
    const c = this.curso();
    if (!c) return;

    this.cursosService.inscribir(c.id).subscribe({
      next: (res) => {
        this.curso.update((prev) => ({
          ...prev,
          miInscripcion: res.inscripcion,
          miProgreso: res.progreso || [],
        }));
      },
      error: (err) => {
        console.error('Error al inscribirse:', err);
        alert('Ocurrió un error al intentar inscribirte en el curso.');
      },
    });
  }

  seleccionarLeccion(modulo: any, leccion: any): void {
    if (!leccion) return;
    this.moduloActivo.set(modulo);
    this.leccionActiva.set(leccion);
    this.quizResultado.set(null);
    this.respuestasQuiz.set({});
    this.preguntaActivaIndex.set(0);
    this.preguntasMarcadas.set({});

    // Si ya tiene calificación guardada, mostrarla
    const prog = this.getProgresoLeccion(leccion.id);
    if (leccion.tipo === 'CUESTIONARIO' && prog && prog.calificacion !== null && prog.calificacion !== undefined) {
      const min = leccion.calificacionMinima ?? 60;
      this.quizResultado.set({
        calificacion: prog.calificacion,
        aprobado: prog.calificacion >= min,
      });
    }
  }

  getProgresoLeccion(leccionId: string): any {
    const c = this.curso();
    if (!c || !c.miProgreso) return null;
    return c.miProgreso.find((p: any) => p.leccionId === leccionId);
  }

  esLeccionCompletada(leccionId: string): boolean {
    return this.esLeccionCompletadaData(leccionId, this.curso()?.miProgreso);
  }

  esLeccionBloqueada(leccionId: string): boolean {
    const c = this.curso();
    if (!c || !c.modulos) return false;

    // Encontrar todas las lecciones en orden secuencial
    const todasLasLecciones: any[] = [];
    for (const m of c.modulos) {
      if (m.lecciones) {
        todasLasLecciones.push(...m.lecciones);
      }
    }

    const idx = todasLasLecciones.findIndex(l => l.id === leccionId);
    if (idx <= 0) {
      return false; // La primera lección de todas nunca está bloqueada
    }

    // Está bloqueada si la anterior no está completada
    const leccionAnterior = todasLasLecciones[idx - 1];
    return !this.esLeccionCompletada(leccionAnterior.id);
  }

  private esLeccionCompletadaData(leccionId: string, progreso: any[]): boolean {
    if (!progreso) return false;
    return progreso.some((p: any) => p.leccionId === leccionId && p.completada);
  }

  /**
   * Lista blanca de dominios permitidos para embeder videos en iframe.
   * bypassSecurityTrustResourceUrl desactiva la protección de Angular,
   * así que solo lo aplicamos a dominios conocidos y confiables.
   */
  private readonly allowedVideoDomains = [
    'youtube.com',
    'www.youtube.com',
    'youtu.be',
    'player.vimeo.com',
    'vimeo.com',
    'drive.google.com',
    'docs.google.com',
  ];

  getSafeVideoUrl(url?: string): SafeResourceUrl | null {
    if (!url) return null;

    let embedUrl = url;
    const ytMatch = url.match(/(?:youtu\.be\/|watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Validar que el dominio está en la lista blanca antes de hacer bypass
    try {
      const parsedUrl = new URL(embedUrl);
      const isAllowed = this.allowedVideoDomains.some(
        (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`),
      );
      if (!isAllowed) {
        console.warn(`Dominio de video no permitido: ${parsedUrl.hostname}`);
        return null;
      }
    } catch {
      // URL malformada — no embeder
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  marcarVisto(): void {
    const c = this.curso();
    const l = this.leccionActiva();
    if (!c || !l) return;

    this.cursosService.registrarProgreso(c.id, l.id, { completada: true }).subscribe({
      next: (res) => {
        this.actualizarEstadoCurso(res);
        setTimeout(() => this.irALaSiguienteActividad(), 800);
      },
      error: (err) => {
        console.error('Error al registrar progreso:', err);
      },
    });
  }

  seleccionarOpcionQuiz(preguntaId: string, opcionId: string): void {
    if (this.esLeccionCompletada(this.leccionActiva()?.id)) return; // No permitir cambiar opción si ya está aprobado
    this.respuestasQuiz.update((prev) => ({ ...prev, [preguntaId]: opcionId }));
  }

  toggleMarcarRevisar(preguntaId: string, event: Event): void {
    event.stopPropagation();
    this.preguntasMarcadas.update((prev) => ({
      ...prev,
      [preguntaId]: !prev[preguntaId],
    }));
  }

  siguientePregunta(): void {
    const l = this.leccionActiva();
    if (!l || !l.preguntas) return;
    const current = this.preguntaActivaIndex();
    if (current < l.preguntas.length - 1) {
      this.preguntaActivaIndex.set(current + 1);
    }
  }

  anteriorPregunta(): void {
    const current = this.preguntaActivaIndex();
    if (current > 0) {
      this.preguntaActivaIndex.set(current - 1);
    }
  }

  irAPregunta(idx: number): void {
    this.preguntaActivaIndex.set(idx);
  }

  enviarCuestionario(): void {
    const c = this.curso();
    const l = this.leccionActiva();
    if (!c || !l || l.tipo !== 'CUESTIONARIO') return;

    if (this.esLeccionCompletada(l.id)) {
      alert('Ya has aprobado esta evaluación.');
      return;
    }

    const preguntas = l.preguntas || [];
    if (preguntas.length === 0) return;

    // ── Bloquear si hay preguntas sin responder ───────────────────────────────
    const sinResponder = this.primeraPreguntaSinResponderIdx();
    if (sinResponder !== -1) {
      this.preguntaActivaIndex.set(sinResponder);
      return;
    }

    // ── Formatear respuestas del alumno para el endpoint de evaluación ───────
    const respuestasMap = this.respuestasQuiz();
    const respuestas = Object.entries(respuestasMap).map(([preguntaId, opcionId]) => ({
      preguntaId,
      opcionId,
    }));

    // ── Enviar al backend para evaluación server-side ────────────────────────
    // El backend compara con esCorrecta (nunca expuesto al cliente) y retorna
    // la calificación real junto con si aprobó o no.
    this.cursosService.evaluarCuestionario(c.id, l.id, respuestas).subscribe({
      next: (res) => {
        this.actualizarEstadoCurso(res);
        this.quizResultado.set({
          calificacion: res.calificacion,
          aprobado: res.aprobado,
        });
      },
      error: (err) => {
        console.error('Error evaluando cuestionario:', err);
      },
    });
  }

  irALaSiguienteActividad(): void {
    const c = this.curso();
    const moduloAct = this.moduloActivo();
    const leccionAct = this.leccionActiva();
    if (!c || !moduloAct || !leccionAct) return;

    const modulos = c.modulos || [];
    const modIndex = modulos.findIndex((m: any) => m.id === moduloAct.id);
    if (modIndex === -1) return;

    const lecciones = moduloAct.lecciones || [];
    const lecIndex = lecciones.findIndex((l: any) => l.id === leccionAct.id);

    if (lecIndex !== -1 && lecIndex < lecciones.length - 1) {
      const sigLec = lecciones[lecIndex + 1];
      this.seleccionarLeccion(moduloAct, sigLec);
    } else if (modIndex < modulos.length - 1) {
      const sigMod = modulos[modIndex + 1];
      if (sigMod.lecciones?.length > 0) {
        this.seleccionarLeccion(sigMod, sigMod.lecciones[0]);
      }
    }
  }

  reintentarCuestionario(): void {
    this.quizResultado.set(null);
    this.respuestasQuiz.set({});
  }

  private actualizarEstadoCurso(res: any): void {
    this.curso.update((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        miInscripcion: res.inscripcion,
        miProgreso: res.progreso || [],
      };
    });
  }
}
