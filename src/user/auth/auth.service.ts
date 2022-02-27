import { scrypt } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
const zxcvbn = require('zxcvbn');

import AppConfig from 'src/globals';
import { UserService } from '../user.service';
import { UserAccount } from '../user.model';
import {
  NewUserRequestData,
  NewUserResponseData,
  PasswordResetData,
} from './auth.model';

const maxCookieAge = 30 * 24 * 3600 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserAccount | null> {
    const userPromise = this.userService.findUser(usernameOrEmail);
    const passHashPromise = this.hash(password);
    const [user, passHash] = await Promise.all([userPromise, passHashPromise]);
    return user && user.key === passHash ? user : null;
  }

  async jwtLogin(user: UserAccount, ip: string, res: Response) {
    const payload = { user: user.username, sub: user.id, origin_ip: ip };
    res.cookie('authorization', await this.jwtService.sign(payload), {
      httpOnly: true,
      secure: process.env.npm_lifecycle_event !== 'start:dev', // use secure cookie in deployment context
      maxAge: maxCookieAge,
      sameSite: 'strict',
    });
    return 'success';
  }

  async hash(password: string): Promise<string> {
    if (!AppConfig.passwordSalt) {
      console.error(
        'User account/password SALT is not configured. Please add it to app.config.',
      );
      throw new ServiceUnavailableException();
    }
    const result = new Promise<string>((resolve) => {
      scrypt(password, AppConfig.passwordSalt, 64, (e, key) => {
        if (e) {
          console.error('There was an error within password hashing.');
          throw e;
        } else {
          return resolve(key.toString('base64url'));
        }
      });
    });

    return await result;
  }

  async validatePassword(password: string, deadKeys: string[] = []) {
    return (
      typeof password === 'string' &&
      password.length >= 8 &&
      zxcvbn(password.slice(0, 80)).score >= 3 &&
      !deadKeys.includes(await this.hash(password))
    );
  }

  async validateNewUserInfo(
    formData: NewUserRequestData,
  ): Promise<NewUserResponseData> {
    const { username: u, email: e, password: p } = formData;

    const isValidUsername = await this.userService.validateNewUsername(u);
    const isValidEmail = await this.userService.validateNewEmail(e);
    const isValidPassword = await this.validatePassword(p);

    return {
      username: isValidUsername,
      email: isValidEmail,
      password: isValidPassword,
    };
  }

  async validatePasswordResetForm(
    formData: PasswordResetData,
  ): Promise<boolean> {
    const { id, password, currentPassword = false } = formData;
    if (!id || !password) {
      throw new BadRequestException(
        'A UserID or password was missing on this request.',
      );
    }

    const oldPasswordClaim = currentPassword && this.hash(currentPassword);
    const user = await this.userService.findUserById(id);

    if (currentPassword) {
      if (user.key !== (await oldPasswordClaim))
        throw new BadRequestException('Current password is incorrect.');
      return (
        user.key !== (await this.hash(password)) && // new password is not current password
        this.validatePassword(password, user.deadKeys) // new password meets req's and is not historic password
      );
    } else {
      // need to add logic here, like an emailed link or security code to prove user identity.
      throw new NotImplementedException(
        'Old password is required to change password at this time.',
      );
      // return this.validatePassword(password);
    }
  }
}
