import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Duración de la cookie: 1 día en milisegundos
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

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

    res.clearCookie('cad_token', {
      path: '/',
      sameSite: 'lax',
      secure: isProd,
      httpOnly: true,
    });

    res.clearCookie('cad_refresh_token', {
      path: '/api/auth',
      sameSite: 'lax',
      secure: isProd,
      httpOnly: true,
    });

    return { message: 'Sesión cerrada correctamente' };
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

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProd = process.env.NODE_ENV === 'production';

    // SameSite=Lax (dev y prod):
    //   ✅ Bloquea CSRF en POST/PUT/DELETE cross-site (el vector real de ataque)
    //   ✅ Funciona aunque front y API estén en subdominios distintos
    //   ✅ HttpOnly + Secure + CORS específico cubren el resto
    //   ℹ️  Strict solo añadiría bloquear clicks desde otros dominios — innecesario aquí

    res.cookie('cad_token', accessToken, {
      httpOnly: true,
      secure: isProd,   // Solo HTTPS en producción
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
      path: '/',
    });

    res.cookie('cad_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });
  }
}
