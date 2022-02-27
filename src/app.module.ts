import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { ManageModule } from './content/manage/manage.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth/auth.module';
import { ActModule } from './act/act.module';
import AppConfig from './globals';

const routes: Routes = [
  {
    path: 'act',
    module: ActModule,
  },
  {
    path: 'content',
    module: ContentModule,
    children: [
      {
        path: 'manage',
        module: ManageModule,
      },
    ],
  },
  {
    path: 'user',
    module: UserModule,
    children: [
      {
        path: 'auth',
        module: AuthModule,
      },
    ],
  },
];

@Module({
  imports: [
    MongooseModule.forRoot(AppConfig.dbConnectionString),
    RouterModule.register(routes),
    UserModule,
    AuthModule,
    ContentModule,
    ManageModule,
    ActModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
