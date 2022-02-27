import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { pubKey } from './auth.init';

export interface UserToken {
  id: string;
  username: string;
  origin_ip: string;
}

@Injectable()
export class StrictLocJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends UserToken>(
    err: any,
    user: TUser | false,
    info: any,
    context: any,
  ): TUser | null {
    const req_ip = context.getRequest().ip;

    if (user && 'origin_ip' in user && req_ip === user.origin_ip) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class BaseJwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: pubKey,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.user,
      origin_ip: payload.origin_ip,
    };
  }
}
