import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize = 1000000; // Define the maximum file size (in bytes)
  private errors: string[] = [];

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      this.errors.push(`No file provided`);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        this.errors.push(`Some files are not provided in the array.`);
      }
      value.forEach((file: Express.Multer.File) =>
        this.validateFileSize(file, metadata),
      );
    } else {
      this.validateFileSize(value, metadata);
    }

    return value;
  }

  /**
   * Validate a single file's size and throw an error if it exceeds the limit.
   * @param file The file to validate.
   */
  private validateFileSize(file: Express.Multer.File, metadata) {
    if (this.errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: this.errors,
        timestamp: new Date().toISOString(),
        path: metadata?.metatype?.name || 'Unknown path',
      });
    }
  }
}
