import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { RecordStatus } from '../../enums/record-status.enum';

export class CreateIdentityDto {
  @IsOptional()
  @IsEnum(RecordStatus, {
    message: 'Status must be DRAFT or COMPLETED.',
  })
  status?: RecordStatus;
}

export class UpdateIdentityDto extends PartialType(CreateIdentityDto) {}
