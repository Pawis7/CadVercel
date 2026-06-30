import { SetMetadata } from '@nestjs/common';

export type Role = 'ADMIN' | 'USER' | 'EDITOR';

export const ROLES_KEY = 'roles';

/**
 * Decorador para restringir el acceso a un endpoint según el rol del usuario.
 * Debe usarse junto con RolesGuard.
 *
 * @example
 * @Roles('ADMIN')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('panel')
 * adminPanel() { ... }
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
