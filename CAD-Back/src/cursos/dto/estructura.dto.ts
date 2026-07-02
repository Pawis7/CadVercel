import { TipoLeccion } from '@prisma/client';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, IsEnum, IsUrl, MaxLength, Min, Max, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

// ─── Opciones de respuesta ─────────────────────────────────────────────────────
export class OpcionDto {
  @IsString()
  @MaxLength(500, { message: 'El texto de la opción no puede exceder 500 caracteres' })
  texto!: string;

  @IsBoolean()
  esCorrecta!: boolean;
}

// ─── Preguntas del cuestionario ────────────────────────────────────────────────
export class PreguntaDto {
  @IsString()
  @MaxLength(1000, { message: 'El texto de la pregunta no puede exceder 1000 caracteres' })
  texto!: string;

  @IsNumber()
  @Min(0)
  @Max(999)
  orden!: number;

  @IsArray()
  @ArrayMaxSize(10, { message: 'Máximo 10 opciones por pregunta' })
  @ValidateNested({ each: true })
  @Type(() => OpcionDto)
  opciones!: OpcionDto[];
}

// ─── Lección (cualquier tipo) ──────────────────────────────────────────────────
export class LeccionDto {
  @IsString()
  @MaxLength(200, { message: 'El título de la lección no puede exceder 200 caracteres' })
  titulo!: string;

  @IsEnum(TipoLeccion)
  tipo!: TipoLeccion;

  @IsNumber()
  @Min(0)
  @Max(999)
  orden!: number;

  @IsOptional()
  @IsBoolean()
  esObligatoria?: boolean;

  // VIDEO
  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_tld: true }, { message: 'recursoUrl debe ser una URL válida' })
  recursoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(86400) // máx. 24 horas en segundos
  duracionSeg?: number;

  // LECTURA
  @IsOptional()
  @IsString()
  @MaxLength(200_000, { message: 'El contenido HTML no puede exceder 200.000 caracteres (~200 KB)' })
  contenidoHtml?: string;

  // ARCHIVO
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombreArchivo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipoMime?: string;

  // CUESTIONARIO
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  calificacionMinima?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50, { message: 'Máximo 50 preguntas por cuestionario' })
  @ValidateNested({ each: true })
  @Type(() => PreguntaDto)
  preguntas?: PreguntaDto[];
}

// ─── Módulo ────────────────────────────────────────────────────────────────────
export class ModuloDto {
  @IsString()
  @MaxLength(200, { message: 'El título del módulo no puede exceder 200 caracteres' })
  titulo!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @Max(999)
  orden!: number;

  @IsArray()
  @ArrayMaxSize(100, { message: 'Máximo 100 lecciones por módulo' })
  @ValidateNested({ each: true })
  @Type(() => LeccionDto)
  lecciones!: LeccionDto[];
}

// ─── Payload principal ─────────────────────────────────────────────────────────
export class EstructuraCursoDto {
  @IsArray()
  @ArrayMaxSize(50, { message: 'Máximo 50 módulos por curso' })
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  modulos!: ModuloDto[];
}
