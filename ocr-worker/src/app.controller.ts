import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UploadInterceptor } from './shared/interceptors/file-upload.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.ping();
  }

  @Post('ocr/recognize')
  @UseInterceptors(
  UploadInterceptor('file'),
    ClassSerializerInterceptor,
  )
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1048576 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.extractTextFromFile(file);
  }
}
