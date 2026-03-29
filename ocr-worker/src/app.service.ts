import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'OCR Worker up and running!';
  }

  extractTextFromFile(file: Express.Multer.File) {
    
  }
}
