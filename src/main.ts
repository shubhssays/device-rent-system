import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './filters/badRequestException.filter';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { MyLogger } from './logger/logger.service';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(), // Use custom Winston logger
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply the global filter
  app.useGlobalFilters(new BadRequestExceptionFilter());
  await app.listen(+process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Server is running on http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
  });
}
bootstrap();