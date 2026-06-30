import { TipoLeccion } from '@prisma/client';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// ─── Opciones de respuesta ─────────────────────────────────────────────────────
export class OpcionDto {
  @IsString()
  texto!: string;

  @IsBoolean()
  esCorrecta!: boolean;
}

// ─── Preguntas del cuestionario ────────────────────────────────────────────────
export class PreguntaDto {
  @IsString()
  texto!: string;

  @IsNumber()
  orden!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpcionDto)
  opciones!: OpcionDto[];
}

// ─── Lección (cualquier tipo) ──────────────────────────────────────────────────
export class LeccionDto {
  @IsString()
  titulo!: string;

  @IsEnum(TipoLeccion)
  tipo!: TipoLeccion;

  @IsNumber()
  orden!: number;

  @IsOptional()
  @IsBoolean()
  esObligatoria?: boolean;

  // VIDEO
  @IsOptional()
  @IsString()
  recursoUrl?: string;

  @IsOptional()
  @IsNumber()
  duracionSeg?: number;

  // LECTURA
  @IsOptional()
  @IsString()
  contenidoHtml?: string;

  // ARCHIVO
  @IsOptional()
  @IsString()
  nombreArchivo?: string;

  @IsOptional()
  @IsString()
  tipoMime?: string;

  // CUESTIONARIO
  @IsOptional()
  @IsNumber()
  calificacionMinima?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreguntaDto)
  preguntas?: PreguntaDto[];
}

// ─── Módulo ────────────────────────────────────────────────────────────────────
export class ModuloDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  orden!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LeccionDto)
  lecciones!: LeccionDto[];
}

// ─── Payload principal ─────────────────────────────────────────────────────────
export class EstructuraCursoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  modulos!: ModuloDto[];
}
