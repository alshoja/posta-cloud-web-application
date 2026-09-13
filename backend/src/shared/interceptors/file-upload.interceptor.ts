import {
  FileInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export function UploadInterceptor(
  fieldName: string,
  maxFileSizeBytes: number = DEFAULT_MAX_FILE_SIZE_BYTES,
) {
  return FileInterceptor(fieldName, {
    storage: memoryStorage(),
    limits: { fileSize: maxFileSizeBytes },
  });
}
