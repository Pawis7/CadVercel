import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';
import { UsersService } from '../../users/users.service';

/**
 * Guard que verifica el rol del usuario en la base de datos en cada petición.
 * Se usa después de JwtAuthGuard para garantizar que req.user ya está validado.
 *
 * Estrategia de seguridad:
 * - Lee el rol directamente de la DB (no del JWT payload) para evitar tokens stale.
 * - Si el usuario no tiene los roles requeridos, lanza 403 Forbidden.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los roles requeridos del decorador @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, la ruta es pública dentro de la autenticación
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user as { id: string; email: string };

    if (!jwtUser?.id) {
      throw new ForbiddenException('Acceso denegado');
    }

    // Consultar el rol directamente desde la DB para evitar tokens con roles obsoletos
    const dbUser = await this.usersService.findById(jwtUser.id);

    if (!dbUser) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    const hasRole = requiredRoles.includes(dbUser.role as Role);

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
