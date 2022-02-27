import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { authorizationCookieParser } from './user/auth/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(authorizationCookieParser);
  await app.listen(3000);
}

bootstrap();
