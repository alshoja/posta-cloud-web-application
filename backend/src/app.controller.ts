import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { AppService } from './app.service';
import { UploadInterceptor } from './shared/interceptors/file-upload.interceptor';
import { OcrService } from './shared/services/ocr.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly ocrService: OcrService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @UseInterceptors(UploadInterceptor('file'), ClassSerializerInterceptor)
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1048576 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.getFileUrl(file);
  }

  @Post('extract/text')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @UseInterceptors(UploadInterceptor('file'), ClassSerializerInterceptor)
  extractText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2048576 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.ocrService.uploadAndQueue(file);
  }

  @Get('extract/text/:jobId')
  async getResult(@Param('jobId') jobId: string) {
    const result = await this.ocrService.getJobResult(jobId);
    return { jobId, result };
  }
}
