import { Module } from '@nestjs/common';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { ValidateFile } from './validators/file.validator';
import { BullModule } from '@nestjs/bullmq';
import { OcrService } from './services/ocr.service';


@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.OCR_QUEUE_NAME || 'ocr-queue',
    }),
  ],
  providers: [ExistsRule, ValidateFile,OcrService],
  exports: [ExistsRule, ValidateFile, OcrService],
})
export class SharedModule {}
