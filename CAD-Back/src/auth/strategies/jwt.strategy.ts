import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const isProd = config.get<string>('NODE_ENV') === 'production';

    // En producción: solo cookie HttpOnly (inmune a XSS, sin exposición en headers/logs).
    // En desarrollo: también acepta Authorization: Bearer para facilitar pruebas con Postman.
    const extractors = [
      (request: Request) => {
        return request?.cookies?.['cad_token'] ?? null;
      },
    ];

    if (!isProd) {
      extractors.push(ExtractJwt.fromAuthHeaderAsBearerToken());
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
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
