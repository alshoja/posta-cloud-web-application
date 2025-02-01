import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Server up to World!';
  }

  getFileUrl(file: Express.Multer.File) {
    return {
      url: `${process.env.BASE_URL}/${file.filename}`,
    };
  }
}
