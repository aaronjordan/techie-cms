import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAccount } from '../user.model';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserAccount | null> {
    const result = await this.authService.validateUser(
      usernameOrEmail,
      password,
    );
    if (!result) throw new UnauthorizedException();
    return result;
  }
}
