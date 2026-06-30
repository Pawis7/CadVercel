import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { UsersModule } from '../users/users.module';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [UsersModule],
  controllers: [CursosController],
  providers: [CursosService, RolesGuard, Reflector],
  exports: [CursosService],
})
export class CursosModule {}
