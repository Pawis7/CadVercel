import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReelsService } from './reels.service';
import { CreateReelDto, UpdateReelDto } from './dto/reels.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reels')
export class ReelsController {
  constructor(private readonly reelsService: ReelsService) {}

  /**
   * GET /reels
   * Obtiene la lista completa de Reels (disponible para consumo de inicio).
   */
  @Get()
  findAll() {
    return this.reelsService.findAll();
  }

  /**
   * GET /reels/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reelsService.findOne(id);
  }

  /**
   * POST /reels
   * Crear Reel (Requiere ADMIN o usuario autenticado)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReelDto) {
    return this.reelsService.create(dto);
  }

  /**
   * PUT /reels/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() dto: UpdateReelDto) {
    return this.reelsService.update(id, dto);
  }

  /**
   * DELETE /reels/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reelsService.remove(id);
  }
}
