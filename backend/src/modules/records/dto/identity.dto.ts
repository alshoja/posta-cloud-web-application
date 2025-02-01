import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateIdentityDto {
  @IsOptional()
  @ValidateIf((o) => o.aadhaarNumber != '')
  @Matches(/^\d{12}$/, {
    message: 'Aadhaar number must be 12 digits.',
  })
  aadhaarNumber?: string;

  @IsOptional()
  @MinLength(15, { message: 'Driving License must be 15 characters.' })
  @ValidateIf((o) => o.drivingLicense != '')
  drivingLicense?: string;

  @IsOptional()
  @ValidateIf((o) => o.electionID != '')
  @IsString({ message: 'Election ID must be a string.' })
  @MinLength(10, { message: 'Election ID must be 10 characters' })
  electionID?: string;

  @IsOptional()
  @ValidateIf((o) => o.passportNumber != '')
  @MinLength(8, { message: 'Passport number must be 8 characters.' })
  passportNumber?: string;

  @IsOptional()
  @IsNumber()
  postBoxNumber?: number;
}

export class UpdateIdentityDto extends PartialType(CreateIdentityDto) {}
