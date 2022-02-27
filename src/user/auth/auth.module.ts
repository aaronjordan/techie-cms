import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import keys from './auth.init';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      publicKey: keys.public,
      privateKey: {
        key: keys.private,
        passphrase: keys.passphrase,
      },
      signOptions: {
        expiresIn: '6h',
        algorithm: 'RS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
