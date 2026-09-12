import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { RecordStatus } from '../enums/record-status.enum';
import { UpdateFinancialAccountDto } from './base/financial-account.dto';


export class StepFiveDto {
  @IsOptional()
  @IsEnum(RecordStatus, {
    message: 'Status must be DRAFT or COMPLETED.',
  })
  status?: RecordStatus;

  @IsOptional()
  @IsArray({ message: 'Financial accounts must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateFinancialAccountDto)
  financialAccounts: UpdateFinancialAccountDto[] = [];
}
