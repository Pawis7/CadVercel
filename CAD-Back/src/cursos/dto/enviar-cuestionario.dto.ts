import { IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/** Una respuesta individual: qué opción eligió el alumno para una pregunta */
export class RespuestaDto {
  @IsString()
  preguntaId: string;

  @IsString()
  opcionId: string;
}

/** Body del endpoint POST /evaluar — array de respuestas del alumno */
export class EnviarCuestionarioDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaDto)
  respuestas: RespuestaDto[];
}
