import { IsString, IsOptional, IsNumber, IsUrl, MinLength, MaxLength } from 'class-validator';

export class CreateReelDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  titulo!: string;

  @IsUrl(
    { protocols: ['https', 'http'], require_tld: true },
    { message: 'videoUrl debe ser una URL válida (https/http)' },
  )
  videoUrl!: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['https', 'http'], require_tld: true },
    { message: 'thumbnailUrl debe ser una URL válida (https/http)' },
  )
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  autorNombre?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['https', 'http'], require_tld: true },
    { message: 'autorAvatar debe ser una URL válida (https/http)' },
  )
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
  @MinLength(3)
  @MaxLength(150)
  titulo?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['https', 'http'], require_tld: true },
    { message: 'videoUrl debe ser una URL válida (https/http)' },
  )
  videoUrl?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['https', 'http'], require_tld: true },
    { message: 'thumbnailUrl debe ser una URL válida (https/http)' },
  )
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  autorNombre?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['https', 'http'], require_tld: true },
    { message: 'autorAvatar debe ser una URL válida (https/http)' },
  )
  autorAvatar?: string;

  @IsOptional()
  @IsNumber()
  duracion?: number;

  @IsOptional()
  @IsNumber()
  orden?: number;
}
