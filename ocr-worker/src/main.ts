import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule);
  console.info('✅ OCR Worker started and listening to the queues...');
}
bootstrap();
