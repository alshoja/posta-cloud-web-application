import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { COUNTRY_NAMES } from 'src/shared/constants/country.constant';
import { RecordStatus } from '../../enums/record-status.enum';

export class CreateOccupationDto {
  @IsOptional()
  @IsEnum(RecordStatus, {
    message: 'Status must be DRAFT or COMPLETED.',
  })
  status?: RecordStatus;

  @IsOptional()
  @IsBoolean({ message: 'Redirection address must be a boolean.' })
  redirectionAddress: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Is abroad must be a boolean.' })
  isAbroad: boolean;

  @IsOptional()
  @IsString({ message: 'Redirected address line 1 must be a string.' })
  redirectedAddressLine1: string;

  @IsOptional()
  @IsString({ message: 'Redirected address line 2 must be a string.' })
  redirectedAddressLine2: string;

  @IsOptional()
  @IsString({ message: 'Job must be a string.' })
  job: string;

  @ValidateIf((o) => o.retirementDate != '')
  @IsOptional()
  @IsDateString({}, { message: 'Retirement date must be a valid date.' })
  retirementDate: string;

  @IsOptional()
  @IsBoolean({ message: 'Is redirected must be a boolean.' })
  isRedirected: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];
}

export class AddressDto {
  @IsOptional()
  id: number;

  @IsOptional()
  @IsString({ message: 'Address line 1 must be a string.' })
  addressLine1?: string;

  @IsOptional()
  @IsString({ message: 'Address line 2 must be a string.' })
  addressLine2?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string.' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string.' })
  state?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @Matches(/^[0-9]{3,10}$/, {
    message: 'Postal code must be 3-10 digits.',
  })
  postalCode?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsIn(COUNTRY_NAMES, { message: 'Country must be a valid country name.' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Location type must be a string.' })
  locationType?: string;
}
export class UpdateOccupationDto extends PartialType(CreateOccupationDto) {}
