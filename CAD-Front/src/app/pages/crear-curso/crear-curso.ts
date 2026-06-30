import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CursosService, EstructuraCursoPayload } from '../../services/cursos';
import { switchMap } from 'rxjs';

// ─── Constantes ──────────────────────────────────────────────────────────────
const MAX_NOMBRE      = 100;
const MAX_DESCRIPCION = 500;
const MAX_ETIQUETA    = 30;
const MAX_ETIQUETAS   = 5;

@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-curso.html',
  styleUrl: './crear-curso.css',
})
export class CrearCurso implements OnInit, OnDestroy {
  // ── Servicios ──────────────────────────────────────────────────────────────
  readonly authService   = inject(AuthService);
  readonly cursosService = inject(CursosService);
  readonly router        = inject(Router);
  readonly fb            = inject(FormBuilder);

  readonly currentUser = this.authService.currentUser;

  // ── Constantes expuestas al template ──────────────────────────────────────
  readonly MAX_NOMBRE      = MAX_NOMBRE;
  readonly MAX_DESCRIPCION = MAX_DESCRIPCION;
  readonly MAX_ETIQUETA    = MAX_ETIQUETA;
  readonly MAX_ETIQUETAS   = MAX_ETIQUETAS;

  readonly niveles: { value: string; label: string; desc: string }[] = [
    { value: 'PRINCIPIANTE', label: 'Principiante', desc: 'Sin conocimientos previos requeridos' },
    { value: 'INTERMEDIO',   label: 'Intermedio',   desc: 'Conocimientos básicos necesarios' },
    { value: 'AVANZADO',     label: 'Avanzado',     desc: 'Experiencia previa recomendada' },
  ];

  readonly estados: { value: string; label: string }[] = [
    { value: 'BORRADOR',  label: 'Borrador' },
    { value: 'PUBLICADO', label: 'Publicado' },
  ];

  // ── Stepper ───────────────────────────────────────────────────────────────
  readonly step    = signal<1 | 2>(1);
  readonly maxStep = 2;

  // ── Estado de guardado ────────────────────────────────────────────────────
  readonly saving       = signal<boolean>(false);
  readonly errorMsg     = signal<string | null>(null);
  readonly successMsg   = signal<string | null>(null);
  readonly toastVisible = signal<boolean>(false);

  // ── Portada ───────────────────────────────────────────────────────────────
  readonly portadaPreview = signal<string | null>(null);
  readonly portadaError   = signal<string | null>(null);
  readonly dragActive     = signal<boolean>(false);
  /** Archivo real seleccionado (para futuro upload a storage) */
  portadaFile: File | null = null;

  // ── Etiqueta en curso de escritura ────────────────────────────────────────
  readonly etiquetaInput = signal<string>('');

  // ── Formulario ────────────────────────────────────────────────────────────
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:           ['', [Validators.required, Validators.minLength(4), Validators.maxLength(MAX_NOMBRE)]],
      descripcion:      ['', [Validators.required, Validators.minLength(10), Validators.maxLength(MAX_DESCRIPCION)]],
      nivel:            ['PRINCIPIANTE', Validators.required],
      estado:           ['BORRADOR', Validators.required],
      duracionEstimada: [null],   // en minutos (opcional)
      etiquetas:        this.fb.array([]),
      modulos:          this.fb.array([]),
    });

    // Agregar un módulo por defecto con una lección de video al iniciar
    this.addModulo();
  }

  ngOnDestroy(): void {}

  // ── Getters de conveniencia ────────────────────────────────────────────────
  get nombreCtrl()      { return this.form.get('nombre')!; }
  get descripcionCtrl() { return this.form.get('descripcion')!; }
  get nivelCtrl()       { return this.form.get('nivel')!; }
  get estadoCtrl()      { return this.form.get('estado')!; }
  get duracionCtrl()    { return this.form.get('duracionEstimada')!; }
  get etiquetasArray()  { return this.form.get('etiquetas') as FormArray; }
  get modulosArray()    { return this.form.get('modulos') as FormArray; }

  get etiquetasList(): string[] {
    return this.etiquetasArray.controls.map(c => c.value as string);
  }

  get nombreLen()      { return this.nombreCtrl.value?.length ?? 0; }
  get descripcionLen() { return this.descripcionCtrl.value?.length ?? 0; }

  get paso1Valido(): boolean {
    return this.nombreCtrl.valid && this.descripcionCtrl.valid;
  }

  // ── Métodos para gestionar Módulos ────────────────────────────────────────
  addModulo(): void {
    const moduloGroup = this.fb.group({
      titulo:      ['', Validators.required],
      descripcion: [''],
      lecciones:   this.fb.array([]),
    });
    this.modulosArray.push(moduloGroup);
  }

  removeModulo(mIndex: number): void {
    this.modulosArray.removeAt(mIndex);
  }

  getLeccionesArray(mIndex: number): FormArray {
    return this.modulosArray.at(mIndex).get('lecciones') as FormArray;
  }

  addLeccion(mIndex: number, tipo: 'VIDEO' | 'LECTURA' | 'CUESTIONARIO'): void {
    const leccionesArray = this.getLeccionesArray(mIndex);
    const leccionGroup = this.fb.group({
      titulo:             ['', Validators.required],
      tipo:               [tipo, Validators.required],
      esObligatoria:      [true],
      recursoUrl:         [''],
      duracionSeg:        [null],
      contenidoHtml:      [''],
      nombreArchivo:      [''],
      tipoMime:           [''],
      calificacionMinima: [80], // 80% por defecto
      preguntas:          this.fb.array([]),
    });

    // Si es un cuestionario, añadimos una pregunta con dos opciones por defecto
    if (tipo === 'CUESTIONARIO') {
      const preguntasArray = leccionGroup.get('preguntas') as FormArray;
      const preguntaGroup = this.fb.group({
        texto:    ['', Validators.required],
        opciones: this.fb.array([
          this.fb.group({ texto: ['', Validators.required], esCorrecta: [true] }),
          this.fb.group({ texto: ['', Validators.required], esCorrecta: [false] }),
        ]),
      });
      preguntasArray.push(preguntaGroup);
    }

    leccionesArray.push(leccionGroup);
  }

  removeLeccion(mIndex: number, lIndex: number): void {
    this.getLeccionesArray(mIndex).removeAt(lIndex);
  }

  getPreguntasArray(mIndex: number, lIndex: number): FormArray {
    return this.getLeccionesArray(mIndex).at(lIndex).get('preguntas') as FormArray;
  }

  addPregunta(mIndex: number, lIndex: number): void {
    const preguntasArray = this.getPreguntasArray(mIndex, lIndex);
    const preguntaGroup = this.fb.group({
      texto:    ['', Validators.required],
      opciones: this.fb.array([
        this.fb.group({ texto: ['', Validators.required], esCorrecta: [true] }),
        this.fb.group({ texto: ['', Validators.required], esCorrecta: [false] }),
      ]),
    });
    preguntasArray.push(preguntaGroup);
  }

  removePregunta(mIndex: number, lIndex: number, pIndex: number): void {
    this.getPreguntasArray(mIndex, lIndex).removeAt(pIndex);
  }

  getOpcionesArray(mIndex: number, lIndex: number, pIndex: number): FormArray {
    return this.getPreguntasArray(mIndex, lIndex).at(pIndex).get('opciones') as FormArray;
  }

  addOpcion(mIndex: number, lIndex: number, pIndex: number): void {
    const opcionesArray = this.getOpcionesArray(mIndex, lIndex, pIndex);
    opcionesArray.push(this.fb.group({ texto: ['', Validators.required], esCorrecta: [false] }));
  }

  removeOpcion(mIndex: number, lIndex: number, pIndex: number, oIndex: number): void {
    const opcionesArray = this.getOpcionesArray(mIndex, lIndex, pIndex);
    if (opcionesArray.length > 2) {
      opcionesArray.removeAt(oIndex);
    }
  }

  setOpcionCorrecta(mIndex: number, lIndex: number, pIndex: number, selectedOIndex: number): void {
    const opcionesArray = this.getOpcionesArray(mIndex, lIndex, pIndex);
    opcionesArray.controls.forEach((ctrl, idx) => {
      ctrl.get('esCorrecta')?.setValue(idx === selectedOIndex);
    });
  }

  // ── Stepper ───────────────────────────────────────────────────────────────
  goToStep(s: 1 | 2): void {
    if (s === 2 && !this.paso1Valido) {
      this.nombreCtrl.markAsTouched();
      this.descripcionCtrl.markAsTouched();
      return;
    }
    this.step.set(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextStep(): void { this.goToStep(2); }
  prevStep(): void { this.step.set(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // ── Portada ───────────────────────────────────────────────────────────────
  onBannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processBanner(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(true);
  }

  onDragLeave(): void {
    this.dragActive.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processBanner(file);
  }

  private processBanner(file: File): void {
    this.portadaError.set(null);
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.portadaError.set('Solo se permiten imágenes JPG, PNG o WebP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.portadaError.set('La imagen no puede superar los 10 MB.');
      return;
    }
    this.portadaFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.portadaPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removeBanner(): void {
    this.portadaPreview.set(null);
    this.portadaFile = null;
    this.portadaError.set(null);
  }

  // ── Etiquetas ─────────────────────────────────────────────────────────────
  onEtiquetaKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addEtiqueta();
    }
  }

  addEtiqueta(): void {
    const tag = this.etiquetaInput().trim().toLowerCase();
    if (!tag || tag.length > MAX_ETIQUETA) return;
    if (this.etiquetasList.includes(tag)) return;
    if (this.etiquetasArray.length >= MAX_ETIQUETAS) return;
    this.etiquetasArray.push(new FormControl(tag));
    this.etiquetaInput.set('');
  }

  removeEtiqueta(index: number): void {
    this.etiquetasArray.removeAt(index);
  }

  // ── Guardar ───────────────────────────────────────────────────────────────
  guardar(estadoOverride?: 'BORRADOR' | 'PUBLICADO'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (!this.paso1Valido) {
        this.step.set(1);
        this.errorMsg.set('Por favor, completa el título y descripción del curso antes de continuar.');
      } else {
        this.errorMsg.set('Por favor, completa los campos requeridos en la estructura (todos los módulos y lecciones deben tener un título válido).');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.saving.set(true);
    this.errorMsg.set(null);

    const raw = this.form.getRawValue();
    const cursoPayload = {
      nombre:           raw.nombre.trim(),
      descripcion:      raw.descripcion.trim(),
      nivel:            raw.nivel,
      estado:           estadoOverride ?? raw.estado,
      duracionEstimada: raw.duracionEstimada ? Number(raw.duracionEstimada) : undefined,
      etiquetas:        raw.etiquetas as string[],
    };

    // Construir estructura DTO
    const estructuraPayload: EstructuraCursoPayload = {
      modulos: raw.modulos.map((m: any, mIdx: number) => ({
        titulo:      m.titulo.trim(),
        descripcion: m.descripcion?.trim() || undefined,
        orden:       mIdx + 1,
        lecciones:   m.lecciones.map((l: any, lIdx: number) => ({
          titulo:             l.titulo.trim(),
          tipo:               l.tipo,
          orden:              lIdx + 1,
          esObligatoria:      l.esObligatoria,
          recursoUrl:         l.recursoUrl?.trim() || undefined,
          duracionSeg:        l.duracionSeg ? Number(l.duracionSeg) : undefined,
          contenidoHtml:      l.contenidoHtml?.trim() || undefined,
          nombreArchivo:      l.nombreArchivo?.trim() || undefined,
          tipoMime:           l.tipoMime?.trim() || undefined,
          calificacionMinima: l.calificacionMinima ? Number(l.calificacionMinima) : undefined,
          preguntas:          l.tipo === 'CUESTIONARIO' ? l.preguntas.map((p: any, pIdx: number) => ({
            texto:    p.texto.trim(),
            orden:    pIdx + 1,
            opciones: p.opciones.map((o: any) => ({
              texto:      o.texto.trim(),
              esCorrecta: Boolean(o.esCorrecta),
            })),
          })) : [],
        })),
      })),
    };

    this.cursosService.createCurso(cursoPayload).pipe(
      switchMap((curso) => {
        if (estructuraPayload.modulos.length > 0) {
          return this.cursosService.saveEstructura(curso.id, estructuraPayload);
        }
        return [curso];
      })
    ).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/cursos']);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(
          err?.error?.message ?? 'Ocurrió un error al guardar el curso. Inténtalo de nuevo.'
        );
      },
    });
  }

  guardarBorrador(): void { this.guardar('BORRADOR'); }
  publicar():        void { this.guardar('PUBLICADO'); }

  volver(): void {
    this.router.navigate(['/cursos']);
  }
}
