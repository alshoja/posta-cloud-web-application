import { Module } from '@nestjs/common';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { ValidateFile } from './validators/file.validator';
import { BullModule } from '@nestjs/bullmq';
import { OcrService } from './services/ocr.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    RedisModule,
    BullModule.registerQueue({
      name: process.env.OCR_QUEUE_NAME || 'ocr-queue',
    }),
  ],
  providers: [ExistsRule, ValidateFile, OcrService],
  exports: [ExistsRule, ValidateFile, OcrService, RedisModule],
})
export class SharedModule { }
