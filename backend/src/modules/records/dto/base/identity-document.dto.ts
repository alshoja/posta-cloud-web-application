import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Matches, ValidateIf } from 'class-validator';

export class CreateIdentityDocumentDto {
  @IsOptional()
  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsString({ message: 'Document type must be a string.' })
  type?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @Matches(/^[A-Za-z0-9\- ]{4,32}$/, {
    message: 'Document number must be 4-32 characters (letters, numbers, spaces, or dashes).',
  })
  number?: string;
}

export class UpdateIdentityDocumentDto extends PartialType(CreateIdentityDocumentDto) {}
