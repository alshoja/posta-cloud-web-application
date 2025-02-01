import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class FileSizeValidationPipe implements PipeTransform {
    private readonly maxSize;
    private errors;
    transform(value: any, metadata: ArgumentMetadata): any;
    private validateFileSize;
}
