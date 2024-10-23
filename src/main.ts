import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './filters/badRequestException.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the global filter
  app.useGlobalFilters(new BadRequestExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
