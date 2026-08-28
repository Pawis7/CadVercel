import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

// Duración de la cookie del refresh token: 7 días en milisegundos (coincide con JWT_REFRESH_EXPIRES_IN)
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Limit: 5 intentos por IP cada 60 segundos.
   * El accessToken se envía en una cookie HttpOnly Secure SameSite=Strict.
   * El refreshToken también va en cookie HttpOnly separada.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    dto.email = dto.email.toLowerCase().trim();
    const tokens = await this.authService.login(dto);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    // Solo confirmamos el éxito — nunca exponemos el token en el body
    return { message: 'Sesión iniciada correctamente' };
  }

  /**
   * POST /auth/register
   * Limit: 5 intentos por IP cada 60 segundos.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    dto.email = dto.email.toLowerCase().trim();
    const tokens = await this.authService.register(dto);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Cuenta creada correctamente' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const sameSiteMode = isProd ? ('none' as const) : ('lax' as const);

    res.clearCookie('cad_token', {
      path: '/',
      sameSite: sameSiteMode,
      secure: isProd,
      httpOnly: true,
    });

    res.clearCookie('cad_refresh_token', {
      path: '/api/auth',
      sameSite: sameSiteMode,
      secure: isProd,
      httpOnly: true,
    });

    return { message: 'Sesión cerrada correctamente' };
  }

  /**
   * POST /auth/refresh
   * Lee el cookie HttpOnly `cad_refresh_token`, lo verifica criptográficamente
   * y emite un nuevo par access + refresh token.
   * Sin throttle agresivo (usa el límite global de 30 req/60s).
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['cad_refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No hay sesión activa para renovar');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Sesión renovada correctamente' };
  }

  /**
   * GET /auth/me
   * Header: Authorization: Bearer <accessToken>
   * Response: datos del usuario autenticado (sin contraseña)
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    return this.authService.me(req.user.id);
  }

  /**
   * GET /auth/admin-verify
   * Verifica en la DB que el usuario autenticado tiene rol ADMIN.
   * El frontend llama a este endpoint al entrar al panel de administración
   * para garantizar que no haya tokens stale con roles incorrectos.
   * Responde 200 si es admin, 403 si no lo es.
   */
  @Get('admin-verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  adminVerify(@Request() req: any) {
    return { isAdmin: true, userId: req.user.id };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProd = process.env.NODE_ENV === 'production';
    const sameSiteMode = isProd ? ('none' as const) : ('lax' as const);

    // Access token: cookie de sesión (sin maxAge) — el JWT ya lleva su propia expiración (15m).
    // En producción cross-origin (Vercel -> Render), SameSite=None + Secure es obligatorio
    // para que el navegador envíe las cookies con withCredentials: true.
    res.cookie('cad_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: sameSiteMode,
      path: '/',
    });

    // Refresh token: maxAge de 7 días (coincide con JWT_REFRESH_EXPIRES_IN).
    // Path /api/auth para aislar el token de refresco.
    res.cookie('cad_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: sameSiteMode,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
      path: '/api/auth',
    });
  }
}
