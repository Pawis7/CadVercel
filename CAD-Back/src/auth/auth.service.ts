import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;   // user ID (cuid)
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AuthTokens> {
    // 1. Buscar usuario por email
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar contraseña
    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      // Mismo mensaje para no revelar si el email existe (anti user enumeration)
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Generar tokens
    return this.generateTokens({ sub: user.id, email: user.email });
  }

  async register(dto: RegisterDto): Promise<AuthTokens> {
    // 1. Verificar si el email ya existe
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2. Hash de contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3. Crear usuario
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
    });

    // 4. Generar tokens
    return this.generateTokens({ sub: user.id, email: user.email });
  }

  /**
   * Verifica criptográficamente el refresh token (firma + expiry) y emite nuevos tokens.
   * El refresh token DEBE llegar como cookie HttpOnly — no como argumento libre.
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET')!;

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });

      // Confirmar que el usuario sigue existiendo en BD
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens({ sub: user.id, email: user.email });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('El refresh token ha expirado, inicia sesión nuevamente');
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Refresh token inválido');
      }
      // Re-lanzar UnauthorizedException ya construidas (user not found, etc.)
      throw err;
    }
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Nunca devolver el hash de la contraseña al cliente
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  private generateTokens(payload: JwtPayload): AuthTokens {
    const jwtSecret = this.config.get<string>('JWT_SECRET')!;
    const jwtExpiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '1d';
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET')!;
    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });

    return { accessToken, refreshToken };
  }
}
