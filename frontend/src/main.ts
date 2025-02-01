import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SharedModule } from './shared/shared.module';
import { AllHttpExceptionFilter } from './shared/filter/http-exception.filter';
// import { SeederService } from './shared/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const seederService = app.get(SeederService);
  // await seederService.seedRecords(100);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: false,
      skipNullProperties: true,
      skipMissingProperties: true,
      skipUndefinedProperties: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllHttpExceptionFilter(app.get(HttpAdapterHost)));
  useContainer(app.select(SharedModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
