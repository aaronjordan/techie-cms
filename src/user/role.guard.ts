import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserAccount } from './user.model';

export const Roles = Object.freeze({
  NONE: 'N',
  VIEWER: 'V',
  SUPPORTER: 'S',
  EDITOR: 'E',
  ADMIN: 'SA',
} as const);

export const UserRoleRanks: readonly UserRole[] = Object.freeze([
  'N',
  'V',
  'S',
  'E',
  'SA',
]);
export type UserRole = typeof Roles[keyof typeof Roles];

export const isUserRoleMet = (minRole, user) => {
  for (const role of UserRoleRanks) {
    // we reach the lower of these two roles first,
    // return true if we get to minRole before userRole
    if (minRole === role) return true;
    if (user === role) return false;
  }
};

export const MinRole = (r: UserRole) => SetMetadata('role', r);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @InjectModel('UserAccount')
    private readonly userAccount: Model<UserAccount>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const id = context.switchToHttp().getRequest().user.id;
    if (!id) throw new UnauthorizedException();

    const userInfo = await this.userAccount.findById(id).exec();
    if (!userInfo) throw new UnauthorizedException();

    const minRole = this.reflector.get<string>('role', context.getHandler());
    return isUserRoleMet(minRole, userInfo);
  }
}
