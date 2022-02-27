import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ManageModule } from './manage/manage.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import {
  BlogPostSchema,
  ProjectSchema,
  ResumeElementSchema,
} from './content.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BlogPost', schema: BlogPostSchema },
      { name: 'Projects', schema: ProjectSchema },
      { name: 'Resume', schema: ResumeElementSchema },
    ]),
    ManageModule,
  ],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
