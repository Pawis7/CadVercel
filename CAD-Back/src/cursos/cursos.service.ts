import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoCurso, NivelCurso } from '@prisma/client';
import { CreateCursoDto, UpdateCursoDto } from './dto/cursos.dto';
import { EstructuraCursoDto } from './dto/estructura.dto';

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

  async findById(id: string, usuarioId?: string) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
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
                    opciones: true,
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
              // LECTURA
              contenidoHtml:      leccionData.contenidoHtml,
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
}
