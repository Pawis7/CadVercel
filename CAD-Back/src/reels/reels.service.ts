import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReelDto, UpdateReelDto } from './dto/reels.dto';

@Injectable()
export class ReelsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna todos los Reels ordenados.
   */
  async findAll() {
    return this.prisma.reel.findMany({
      orderBy: [
        { orden: 'asc' },
        { creadoEn: 'desc' },
      ],
    });
  }

  /**
   * Obtiene un Reel por ID.
   */
  async findOne(id: string) {
    const reel = await this.prisma.reel.findUnique({ where: { id } });
    if (!reel) throw new NotFoundException('Reel no encontrado');
    return reel;
  }

  /**
   * Crea un nuevo Reel.
   */
  async create(dto: CreateReelDto) {
    return this.prisma.reel.create({
      data: dto,
    });
  }

  /**
   * Actualiza un Reel existente.
   */
  async update(id: string, dto: UpdateReelDto) {
    await this.findOne(id);
    return this.prisma.reel.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Elimina un Reel.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reel.delete({ where: { id } });
  }
}
