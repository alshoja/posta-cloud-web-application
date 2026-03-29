import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: process.env.QUEUE_NAME || 'ocr-queue',
    }),
  ],
  exports: [BullModule],
  providers: [],
})
export class SharedModule {}
