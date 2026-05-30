import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { ValidateFile } from './validators/file.validator';
import { BullModule } from '@nestjs/bullmq';
import { OcrService } from './services/ocr.service';
import { RedisModule } from './redis.module';
import { OCR_QUEUE_NAME } from './constants/queue.constants';
import { EncryptionConfigService } from './services/encryption-config.service';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    BullModule.registerQueue({
      name: OCR_QUEUE_NAME,
    }),
  ],
  providers: [ExistsRule, ValidateFile, OcrService, EncryptionConfigService],
  exports: [ExistsRule, ValidateFile, OcrService, RedisModule],
})
export class SharedModule { }
