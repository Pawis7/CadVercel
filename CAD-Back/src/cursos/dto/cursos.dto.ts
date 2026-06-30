import { NivelCurso, EstadoCurso } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsEnum, IsNumber, MinLength, MaxLength } from 'class-validator';

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
  @IsString()
  portada?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  etiquetas?: string[];

  @IsOptional()
  @IsEnum(NivelCurso)
  nivel?: NivelCurso;

  @IsOptional()
  @IsEnum(EstadoCurso)
  estado?: EstadoCurso;

  @IsOptional()
  @IsNumber()
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
  @IsString()
  portada?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  etiquetas?: string[];

  @IsOptional()
  @IsEnum(NivelCurso)
  nivel?: NivelCurso;

  @IsOptional()
  @IsEnum(EstadoCurso)
  estado?: EstadoCurso;

  @IsOptional()
  @IsNumber()
  duracionEstimada?: number;
}
