import { NivelCurso, EstadoCurso } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, MinLength, MaxLength, ArrayMaxSize, Min, Max } from 'class-validator';

/**
 * DTO para crear un curso.
 * Todos los campos tienen decoradores de class-validator para cumplir con el ValidationPipe.
 */
export class CreateCursoDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  descripcion!: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_tld: true }, { message: 'La portada debe ser una URL válida' })
  portada?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'Máximo 20 etiquetas' })
  @IsString({ each: true })
  @MaxLength(50, { each: true, message: 'Cada etiqueta puede tener máximo 50 caracteres' })
  etiquetas?: string[];

  @IsOptional()
  @IsEnum(NivelCurso)
  nivel?: NivelCurso;

  @IsOptional()
  @IsEnum(EstadoCurso)
  estado?: EstadoCurso;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  duracionEstimada?: number;
}

/**
 * DTO para actualizar un curso (todos los campos son opcionales).
 */
export class UpdateCursoDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_tld: true }, { message: 'La portada debe ser una URL válida' })
  portada?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'Máximo 20 etiquetas' })
  @IsString({ each: true })
  @MaxLength(50, { each: true, message: 'Cada etiqueta puede tener máximo 50 caracteres' })
  etiquetas?: string[];

  @IsOptional()
  @IsEnum(NivelCurso)
  nivel?: NivelCurso;

  @IsOptional()
  @IsEnum(EstadoCurso)
  estado?: EstadoCurso;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  duracionEstimada?: number;
}
