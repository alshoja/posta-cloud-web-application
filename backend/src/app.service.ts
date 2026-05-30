import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Server up to World!';
  }

  getFileUrl(file: Express.Multer.File) {
    const baseUrl = this.configService.get<string>('config.baseUrl');
    return {
      url: `${baseUrl}/${file.filename}`,
    };
  }
}
