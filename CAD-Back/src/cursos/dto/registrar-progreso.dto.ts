import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

/**
 * DTO para registrar el progreso de una lección.
 * Reemplaza el body anónimo previo — garantiza validación de tipos con ValidationPipe.
 */
export class RegistrarProgresoDto {
  @IsBoolean({ message: 'completada debe ser un valor booleano' })
  completada: boolean;

  /** Calificación del cuestionario (0–100). Solo aplica para lecciones tipo CUESTIONARIO. */
  @IsOptional()
  @IsNumber({}, { message: 'calificacion debe ser un número' })
  @Min(0, { message: 'La calificación mínima es 0' })
  @Max(100, { message: 'La calificación máxima es 100' })
  calificacion?: number;

  /** Tiempo visto del video en segundos. Solo aplica para lecciones tipo VIDEO. */
  @IsOptional()
  @IsNumber({}, { message: 'tiempoVisto debe ser un número' })
  @Min(0, { message: 'El tiempo visto no puede ser negativo' })
  @Max(86400, { message: 'El tiempo visto no puede exceder 24 horas (86400 s)' })
  tiempoVisto?: number;
}
