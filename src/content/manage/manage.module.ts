import { Module } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountSchema } from 'src/user/user.model';

import {
  BlogPostSchema,
  ProjectSchema,
  ResumeElementSchema,
} from '../content.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BlogPost', schema: BlogPostSchema },
      { name: 'Projects', schema: ProjectSchema },
      { name: 'Resume', schema: ResumeElementSchema },
      { name: 'UserAccount', schema: UserAccountSchema },
    ]),
  ],
  providers: [ManageService],
  controllers: [ManageController],
})
export class ManageModule {}
