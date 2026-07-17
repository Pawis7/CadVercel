import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoCurso, NivelCurso } from '@prisma/client';
import { CreateCursoDto, UpdateCursoDto } from './dto/cursos.dto';
import { EstructuraCursoDto } from './dto/estructura.dto';
import sanitizeHtml from 'sanitize-html';

/** Configuración permitida para HTML de lecciones de lectura */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'blockquote', 'pre', 'code',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'div', 'span',
  ],
  allowedAttributes: {
    a:   ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    '*': ['class', 'id'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
  // Bloquea js: data: etc. en href/src
  allowedSchemesByTag: {
    a:   ['https', 'http', 'mailto'],
    img: ['https', 'http'],
  },
};

@Injectable()
export class CursosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna todos los cursos PUBLICADOS con el autor y conteos de módulos e inscritos.
   * Usada en el catálogo público (usuarios normales).
   */
  async findAllPublicados(usuarioId?: string) {
    const selectFields: any = {
      id: true,
      nombre: true,
      descripcion: true,
      portada: true,
      etiquetas: true,
      nivel: true,
      estado: true,
      duracionEstimada: true,
      autor: {
        select: { firstName: true, lastName: true },
      },
      _count: {
        select: { modulos: true, inscritos: true },
      },
      // Primera lección tipo VIDEO de cualquier módulo para el thumbnail
      modulos: {
        orderBy: { orden: 'asc' },
        take: 1,
        select: {
          lecciones: {
            where: { tipo: 'VIDEO' },
            orderBy: { orden: 'asc' },
            take: 1,
            select: { recursoUrl: true, titulo: true },
          },
        },
      },
    };

    if (usuarioId) {
      selectFields.inscritos = {
        where: { usuarioId },
        select: { porcentaje: true },
      };
    }

    const cursos = await this.prisma.curso.findMany({
      where: { estado: 'PUBLICADO' },
      orderBy: { creadoEn: 'desc' },
      select: selectFields,
    });

    // Extraer videoIntro y limpiar la estructura de módulos del response
    const cursosConVideo = cursos.map((curso: any) => {
      const { modulos, inscritos, ...rest } = curso;
      const primeraLeccionVideo = modulos?.[0]?.lecciones?.[0] ?? null;
      return {
        ...rest,
        inscripciones: inscritos,
        videoIntro: primeraLeccionVideo?.recursoUrl ?? null,
        videoIntroTitulo: primeraLeccionVideo?.titulo ?? null,
      };
    });

    return cursosConVideo;
  }

  /**
   * Retorna TODOS los cursos (incluye borradores y archivados).
   * Solo para administradores.
   */
  async findAll(usuarioId?: string) {
    const selectFields: any = {
      id: true,
      nombre: true,
      descripcion: true,
      portada: true,
      etiquetas: true,
      nivel: true,
      estado: true,
      duracionEstimada: true,
      autor: {
        select: { firstName: true, lastName: true },
      },
      _count: {
        select: { modulos: true, inscritos: true },
      },
    };

    if (usuarioId) {
      selectFields.inscritos = {
        where: { usuarioId },
        select: { porcentaje: true },
      };
    }

    const cursos = await this.prisma.curso.findMany({
      orderBy: { creadoEn: 'desc' },
      select: selectFields,
    });

    if (usuarioId) {
      return cursos.map((curso: any) => {
        const { inscritos, ...rest } = curso;
        return {
          ...rest,
          inscripciones: inscritos,
        };
      });
    }

    return cursos;
  }

  /**
   * Busca un curso por ID aplicando reglas de acceso según el rol:
   *
   * - Usuarios normales (USER/EDITOR): solo ven cursos PUBLICADOS.
   *   Las opciones de cuestionario se devuelven SIN `esCorrecta`
   *   para evitar que los alumnos obtengan las respuestas correctas
   *   inspeccionando la respuesta de la API.
   *
   * - Administradores: ven cualquier estado (BORRADOR, ARCHIVADO).
   *   Reciben `esCorrecta` para poder editar los cuestionarios.
   *
   * - isAdminContext = true: usado internamente por endpoints de
   *   edición/borrado (PUT, DELETE) donde no hay un usuarioId pero
   *   el guard ya garantizó que el caller es ADMIN.
   */
  async findById(id: string, usuarioId?: string, isAdminContext = false) {
    // Determinar si la petición viene de un admin
    let isAdmin = isAdminContext;

    if (usuarioId && !isAdminContext) {
      const user = await this.prisma.user.findUnique({
        where: { id: usuarioId },
        select: { role: true },
      });
      isAdmin = user?.role === 'ADMIN';
    }

    const curso = await this.prisma.curso.findUnique({
      where: {
        id,
        // Alumnos solo acceden a cursos publicados
        ...(!isAdmin && { estado: 'PUBLICADO' }),
      },
      include: {
        autor: { select: { firstName: true, lastName: true } },
        _count: { select: { modulos: true, inscritos: true } },
        modulos: {
          orderBy: { orden: 'asc' },
          include: {
            lecciones: {
              orderBy: { orden: 'asc' },
              include: {
                preguntas: {
                  orderBy: { orden: 'asc' },
                  include: {
                    // Admins ven esCorrecta para editar; alumnos solo ven id y texto
                    opciones: isAdmin
                      ? true
                      : { select: { id: true, texto: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!curso) return null;

    let inscripcion: any = null;
    let progreso: any[] = [];

    if (usuarioId) {
      inscripcion = await this.prisma.inscripcion.findUnique({
        where: {
          usuarioId_cursoId: { usuarioId, cursoId: id },
        },
      });

      if (inscripcion) {
        progreso = await this.prisma.progreso.findMany({
          where: { inscripcionId: inscripcion.id },
        });
      }
    }

    return {
      ...curso,
      miInscripcion: inscripcion,
      miProgreso: progreso,
    };
  }


  async create(data: CreateCursoDto, autorId: string) {
    return this.prisma.curso.create({
      data: {
        nombre:           data.nombre,
        descripcion:      data.descripcion,
        portada:          data.portada,
        etiquetas:        data.etiquetas ?? [],
        nivel:            data.nivel ?? 'PRINCIPIANTE',
        estado:           data.estado ?? 'BORRADOR',
        duracionEstimada: data.duracionEstimada,
        autorId,
      },
    });
  }

  async update(id: string, data: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { id },
      data: {
        ...(data.nombre !== undefined            && { nombre:            data.nombre }),
        ...(data.descripcion !== undefined       && { descripcion:       data.descripcion }),
        ...(data.portada !== undefined           && { portada:           data.portada }),
        ...(data.etiquetas !== undefined         && { etiquetas:         data.etiquetas }),
        ...(data.nivel !== undefined             && { nivel:             data.nivel }),
        ...(data.estado !== undefined            && { estado:            data.estado }),
        ...(data.duracionEstimada !== undefined  && { duracionEstimada:  data.duracionEstimada }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.curso.delete({ where: { id } });
  }

  /**
   * Guarda (o reemplaza) toda la estructura de módulos, lecciones, preguntas
   * y opciones en una sola transacción atómica.
   *
   * Estrategia:
   *   1. Borra todos los módulos existentes (cascade a lecciones/preguntas/opciones).
   *   2. Recrea la estructura completa desde el payload.
   *
   * Si algo falla a mitad, Prisma revierte todo — no quedan datos a medias.
   * Además calcula automáticamente la duracionEstimada del curso
   * sumando la duración de todos los videos.
   */
  async saveEstructura(cursoId: string, dto: EstructuraCursoDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Eliminar módulos existentes (cascade: lecciones → preguntas → opciones)
      await tx.modulo.deleteMany({ where: { cursoId } });

      // 2. Recrear la estructura completa
      for (const moduloData of dto.modulos) {
        const modulo = await tx.modulo.create({
          data: {
            cursoId,
            titulo:      moduloData.titulo,
            descripcion: moduloData.descripcion,
            orden:       moduloData.orden,
          },
        });

        for (const leccionData of moduloData.lecciones) {
          const leccion = await tx.leccion.create({
            data: {
              moduloId:           modulo.id,
              titulo:             leccionData.titulo,
              tipo:               leccionData.tipo,
              orden:              leccionData.orden,
              esObligatoria:      leccionData.esObligatoria ?? true,
              // VIDEO
              recursoUrl:         leccionData.recursoUrl,
              duracionSeg:        leccionData.duracionSeg,
              // LECTURA — sanitizar HTML para prevenir XSS stored
              contenidoHtml:      leccionData.contenidoHtml
                ? sanitizeHtml(leccionData.contenidoHtml, SANITIZE_OPTIONS)
                : undefined,
              // ARCHIVO
              nombreArchivo:      leccionData.nombreArchivo,
              tipoMime:           leccionData.tipoMime,
              // CUESTIONARIO
              calificacionMinima: leccionData.calificacionMinima,
            },
          });

          // Solo los cuestionarios tienen preguntas y opciones
          if (leccionData.tipo === 'CUESTIONARIO' && leccionData.preguntas?.length) {
            for (const preguntaData of leccionData.preguntas) {
              const pregunta = await tx.pregunta.create({
                data: {
                  leccionId: leccion.id,
                  texto:     preguntaData.texto,
                  orden:     preguntaData.orden,
                },
              });

              if (preguntaData.opciones?.length) {
                await tx.opcion.createMany({
                  data: preguntaData.opciones.map((op) => ({
                    preguntaId: pregunta.id,
                    texto:      op.texto,
                    esCorrecta: op.esCorrecta,
                  })),
                });
              }
            }
          }
        }
      }

      // 3. Recalcular duracionEstimada sumando videos
      const totalSeg = dto.modulos
        .flatMap((m) => m.lecciones)
        .filter((l) => l.tipo === 'VIDEO' && l.duracionSeg)
        .reduce((sum, l) => sum + (l.duracionSeg ?? 0), 0);

      if (totalSeg > 0) {
        await tx.curso.update({
          where: { id: cursoId },
          data:  { duracionEstimada: Math.ceil(totalSeg / 60) },
        });
      }

      return {
        message:   'Estructura guardada correctamente',
        modulos:   dto.modulos.length,
        lecciones: dto.modulos.reduce((s, m) => s + m.lecciones.length, 0),
      };
    });
  }

  /**
   * Inscribe a un usuario en un curso si no está inscrito.
   */
  async inscribir(cursoId: string, usuarioId: string) {
    const inscripcion = await this.prisma.inscripcion.upsert({
      where: { usuarioId_cursoId: { usuarioId, cursoId } },
      update: {},
      create: {
        usuarioId,
        cursoId,
        porcentaje: 0,
      },
    });

    const progreso = await this.prisma.progreso.findMany({
      where: { inscripcionId: inscripcion.id },
    });

    return { inscripcion, progreso };
  }

  /**
   * Registra el progreso de una lección (video, lectura o cuestionario) y recalcula el % del curso.
   */
  async registrarProgreso(
    cursoId: string,
    leccionId: string,
    usuarioId: string,
    data: { completada: boolean; calificacion?: number; tiempoVisto?: number },
  ) {
    // 1. Asegurar inscripción
    const inscripcion = await this.prisma.inscripcion.upsert({
      where: { usuarioId_cursoId: { usuarioId, cursoId } },
      update: {},
      create: { usuarioId, cursoId, porcentaje: 0 },
    });

    // 2. Verificar que la lección pertenece al curso indicado
    const leccion = await this.prisma.leccion.findFirst({
      where: {
        id: leccionId,
        modulo: { cursoId },
      },
    });

    if (!leccion) {
      throw new NotFoundException('La lección no existe o no pertenece a este curso.');
    }

    let completada = data.completada;
    if (leccion.tipo === 'CUESTIONARIO' && data.calificacion !== undefined) {
      const min = leccion.calificacionMinima ?? 60;
      completada = data.calificacion >= min;
    }

    // 3. Guardar progreso de la lección
    await this.prisma.progreso.upsert({
      where: {
        inscripcionId_leccionId: {
          inscripcionId: inscripcion.id,
          leccionId,
        },
      },
      update: {
        completada,
        ...(completada && { completadaEn: new Date() }),
        ...(data.calificacion !== undefined && { calificacion: data.calificacion }),
        ...(data.tiempoVisto !== undefined && { tiempoVisto: data.tiempoVisto }),
      },
      create: {
        inscripcionId: inscripcion.id,
        leccionId,
        completada,
        completadaEn: completada ? new Date() : null,
        calificacion: data.calificacion,
        tiempoVisto: data.tiempoVisto,
      },
    });

    // 4. Recalcular % en base a fases obligatorias
    const todasLasLecciones = await this.prisma.leccion.findMany({
      where: { modulo: { cursoId } },
    });
    const obligatorias = todasLasLecciones.filter((l) => l.esObligatoria !== false);
    const pool = obligatorias.length > 0 ? obligatorias : todasLasLecciones;

    const progresos = await this.prisma.progreso.findMany({
      where: { inscripcionId: inscripcion.id, completada: true },
    });

    const completadosCount = pool.filter((l) =>
      progresos.some((p) => p.leccionId === l.id && p.completada),
    ).length;

    const porcentaje = pool.length > 0 ? Math.round((completadosCount / pool.length) * 100) : 100;

    const inscripcionActualizada = await this.prisma.inscripcion.update({
      where: { id: inscripcion.id },
      data: {
        porcentaje,
        completadoEn: porcentaje >= 100 ? new Date() : null,
      },
    });

    const todosLosProgresos = await this.prisma.progreso.findMany({
      where: { inscripcionId: inscripcion.id },
    });

    return {
      inscripcion: inscripcionActualizada,
      progreso: todosLosProgresos,
      porcentaje,
      completadosCount,
      totalPasos: pool.length,
    };
  }

  /**
   * Evalúa un cuestionario server-side.
   * Recibe las respuestas del alumno, las compara con `esCorrecta` en la DB
   * (campo que nunca se expone al cliente) y calcula la calificación real.
   * Llama internamente a registrarProgreso para persistir el resultado.
   */
  async evaluarCuestionario(
    cursoId: string,
    leccionId: string,
    usuarioId: string,
    respuestas: { preguntaId: string; opcionId: string }[],
  ) {
    // 1. Cargar la lección con todas sus preguntas y opciones
    const leccion = await this.prisma.leccion.findFirst({
      where: { id: leccionId, modulo: { cursoId } },
      include: {
        preguntas: {
          include: { opciones: true },
        },
      },
    });

    if (!leccion) {
      throw new NotFoundException('La lección no existe o no pertenece a este curso.');
    }

    if (leccion.tipo !== 'CUESTIONARIO') {
      throw new BadRequestException('Esta lección no es un cuestionario.');
    }

    const totalPreguntas = leccion.preguntas.length;
    if (totalPreguntas === 0) {
      throw new BadRequestException('El cuestionario no tiene preguntas configuradas.');
    }

    // 2. Verificar que se respondieron todas las preguntas
    if (respuestas.length !== totalPreguntas) {
      throw new BadRequestException(
        `Se esperaban ${totalPreguntas} respuestas pero se recibieron ${respuestas.length}.`,
      );
    }

    // 3. Comparar respuestas con esCorrecta (server-side, nunca expuesto al cliente)
    let correctas = 0;
    for (const resp of respuestas) {
      const pregunta = leccion.preguntas.find((p) => p.id === resp.preguntaId);
      if (!pregunta) {
        throw new BadRequestException(`Pregunta desconocida: ${resp.preguntaId}`);
      }
      const opcion = pregunta.opciones.find((o) => o.id === resp.opcionId);
      if (!opcion) {
        throw new BadRequestException(`Opción desconocida: ${resp.opcionId}`);
      }
      if (opcion.esCorrecta) correctas++;
    }

    // 4. Calcular calificación (0-100)
    const calificacion = Math.round((correctas / totalPreguntas) * 100);
    const minima = leccion.calificacionMinima ?? 60;
    const aprobado = calificacion >= minima;

    // 5. Persistir resultado reutilizando la lógica existente
    const resultado = await this.registrarProgreso(cursoId, leccionId, usuarioId, {
      completada: aprobado,
      calificacion,
    });

    return {
      calificacion,
      aprobado,
      correctas,
      total: totalPreguntas,
      calificacionMinima: minima,
      ...resultado,
    };
  }
}
