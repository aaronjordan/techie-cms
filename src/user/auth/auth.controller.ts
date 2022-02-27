import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user.service';
import {
  NewUserRequestData,
  NewUserResponseData,
  PasswordResetData,
} from './auth.model';
import { AuthService } from './auth.service';
import { StrictLocJwtAuthGuard } from './jwt.strategy';
import { LocalAuthGuard } from './local.strategy';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(StrictLocJwtAuthGuard)
  @Get('token')
  token(@Request() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    // fixme could filter props of the user object here?
    // actually no - make a 'profile/view something that gives user info?
    await this.userService.logUserSeen(req.user);
    res.send(await this.authService.jwtLogin(req.user, req.ip, res));
  }

  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('authorization');
    res.send('ok');
  }

  @Post('register')
  async register(
    @Body() formData: NewUserRequestData,
  ): Promise<NewUserResponseData> {
    formData.username = formData.username?.trim();
    formData.email = formData.email?.trim();

    const userValidation = await this.authService.validateNewUserInfo(formData);
    const isUserValid = Object.values(userValidation).every((x) => x === true);
    if (isUserValid) {
      const userId = await this.userService.createNewUser({
        ...formData,
        password: await this.authService.hash(formData.password),
      });
      return { ...userValidation, id: userId };
    } else {
      throw new BadRequestException(userValidation);
    }
  }

  @Post('changePassword')
  @UseGuards(StrictLocJwtAuthGuard)
  async changePassword(
    @Body() formData: PasswordResetData,
  ): Promise<{ result: string }> {
    if (await this.authService.validatePasswordResetForm(formData)) {
      const hash = this.authService.hash(formData.password);

      await this.userService.changePassword({
        id: formData.id,
        password: await hash,
      });
      await this.userService.logUserSeen({ id: formData.id });
    } else {
      throw new BadRequestException();
    }
    return { result: 'success' };
  }
}
