import { IsString, IsOptional, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateReelDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  titulo!: string;

  @IsString()
  videoUrl!: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  autorNombre?: string;

  @IsOptional()
  @IsString()
  autorAvatar?: string;

  @IsOptional()
  @IsNumber()
  duracion?: number;

  @IsOptional()
  @IsNumber()
  orden?: number;
}

export class UpdateReelDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  autorNombre?: string;

  @IsOptional()
  @IsString()
  autorAvatar?: string;

  @IsOptional()
  @IsNumber()
  duracion?: number;

  @IsOptional()
  @IsNumber()
  orden?: number;
}
