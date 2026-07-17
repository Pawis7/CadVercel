import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto, UpdateCursoDto } from './dto/cursos.dto';
import { EstructuraCursoDto } from './dto/estructura.dto';
import { RegistrarProgresoDto } from './dto/registrar-progreso.dto';
import { EnviarCuestionarioDto } from './dto/enviar-cuestionario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  /**
   * GET /cursos
   * Público (requiere sesión). Retorna solo los cursos PUBLICADOS.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    return this.cursosService.findAllPublicados(req?.user?.id);
  }

  /**
   * GET /cursos/admin/all
   * Solo ADMIN. Retorna TODOS los cursos (incluyendo borradores y archivados).
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAllAdmin(@Request() req: any) {
    return this.cursosService.findAll(req?.user?.id);
  }

  /**
   * GET /cursos/:id
   * Requiere sesión. Retorna un curso por su ID.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req: any) {
    const curso = await this.cursosService.findById(id, req?.user?.id);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return curso;
  }

  /**
   * POST /cursos/:id/inscribir
   * Inscribe al usuario en el curso.
   */
  @Post(':id/inscribir')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  inscribir(@Param('id') id: string, @Request() req: any) {
    return this.cursosService.inscribir(id, req.user.id);
  }

  /**
   * POST /cursos/:id/lecciones/:leccionId/progreso
   * Registra o actualiza el progreso en una lección específica.
   */
  @Post(':id/lecciones/:leccionId/progreso')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  registrarProgreso(
    @Param('id') cursoId: string,
    @Param('leccionId') leccionId: string,
    @Body() body: RegistrarProgresoDto,
    @Request() req: any,
  ) {
    return this.cursosService.registrarProgreso(cursoId, leccionId, req.user.id, body);
  }

  /**
   * POST /cursos/:id/lecciones/:leccionId/evaluar
   * Evalúa un cuestionario server-side: recibe las respuestas del alumno,
   * compara con esCorrecta en la DB y retorna calificación real.
   */
  @Post(':id/lecciones/:leccionId/evaluar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  evaluarCuestionario(
    @Param('id') cursoId: string,
    @Param('leccionId') leccionId: string,
    @Body() body: EnviarCuestionarioDto,
    @Request() req: any,
  ) {
    return this.cursosService.evaluarCuestionario(cursoId, leccionId, req.user.id, body.respuestas);
  }

  /**
   * POST /cursos
   * Solo ADMIN. Crea un nuevo curso con el admin como autor.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCursoDto, @Request() req: any) {
    return this.cursosService.create(dto, req.user.id);
  }

  /**
   * PUT /cursos/:id
   * Solo ADMIN. Actualiza los campos básicos de un curso existente.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateCursoDto) {
    // isAdminContext=true: el RolesGuard ya verificó ADMIN, se puede acceder a borradores
    const curso = await this.cursosService.findById(id, undefined, true);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return this.cursosService.update(id, dto);
  }

  /**
   * PUT /cursos/:id/estructura
   * Solo ADMIN. Reemplaza toda la estructura de módulos, lecciones, preguntas y opciones.
   */
  @Put(':id/estructura')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateEstructura(@Param('id') id: string, @Body() dto: EstructuraCursoDto) {
    const curso = await this.cursosService.findById(id, undefined, true);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return this.cursosService.saveEstructura(id, dto);
  }

  /**
   * DELETE /cursos/:id
   * Solo ADMIN. Elimina un curso y en cascada sus módulos y lecciones.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const curso = await this.cursosService.findById(id, undefined, true);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    await this.cursosService.remove(id);
    return { message: 'Curso eliminado correctamente' };
  }
}
