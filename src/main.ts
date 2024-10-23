import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './filters/badRequestException.filter';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply the global filter
  app.useGlobalFilters(new BadRequestExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
