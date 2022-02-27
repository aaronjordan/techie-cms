import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StrictLocJwtAuthGuard } from './auth/jwt.strategy';
import { UserAccountUpdate, UserAccountUpdateBody } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(StrictLocJwtAuthGuard)
  @Get()
  async profile(@Request() req) {
    return await this.userService.getSelfProfile(
      req.user.id,
      req.user.username,
    );
  }

  /**
   * Handles updates to user-managed fields on the user's profile object.
   * @param req a request expected to contain the user's JWT token
   * @param body the JSON content describing changes to make to the user's profile
   */
  @UseGuards(StrictLocJwtAuthGuard)
  @Post('update')
  async update(@Request() req, @Body() body: UserAccountUpdateBody) {
    const update = new UserAccountUpdate(body);
    if (!update.isValid()) {
      throw new BadRequestException();
    }
    const result = this.userService.updateUserData(req.user.id, update);
    await this.userService.logUserSeen({ id: req.user.id });
    return result;
  }
}
