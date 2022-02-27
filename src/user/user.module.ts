import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAccountSchema } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserAccount', schema: UserAccountSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
