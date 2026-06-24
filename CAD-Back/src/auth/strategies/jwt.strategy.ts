import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      // Extrae el JWT primero desde la cookie HttpOnly 'cad_token' (inmune a XSS).
      // Si no está en cookie, acepta el header Authorization como fallback (APIs/Postman).
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['cad_token'] ?? null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    // Lo que retornes aquí se adjunta a request.user
    return { id: payload.sub, email: payload.email };
  }
}
