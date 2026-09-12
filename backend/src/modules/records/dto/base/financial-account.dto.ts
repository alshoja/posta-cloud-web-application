import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Matches, ValidateIf } from 'class-validator';

export class CreateFinancialAccountDto {
  @IsOptional()
  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsString({ message: 'Account type must be a string.' })
  type?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @Matches(/^[A-Za-z0-9\- ]{4,32}$/, {
    message: 'Account number must be 4-32 characters (letters, numbers, spaces, or dashes).',
  })
  number?: string;
}

export class UpdateFinancialAccountDto extends PartialType(CreateFinancialAccountDto) {}
