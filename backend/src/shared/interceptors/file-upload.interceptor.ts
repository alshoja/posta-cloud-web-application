import {
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function UploadInterceptor(fieldName: string, destination = './uploads') {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination,
      filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        callback(null, uniqueName);
      },
    }),
  });
}