import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty({ message: 'name is required.' })
  name: string;

  @IsNotEmpty({ message: 'name is required.' })
  file: string;

  @IsNotEmpty({ message: 'name is required.' })
  recordsId: number;
}

export class UpdateDocumentDto extends PartialType(DocumentDto) {}
