import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { COUNTRY_NAMES } from 'src/shared/constants/country.constant';
import { Gender } from '../../enums/gender.enum';
import { RecordStatus } from '../../enums/record-status.enum';

export class CreateProfileDto {
  @ValidateIf((o) => o.id != '')
  @IsOptional()
  @IsNumber()
  id: number;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsString({ message: 'Profile image must be a string.' })
  profileImage: string;

  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsString({ message: 'Last name must be a string.' })
  lastName?: string;

  @IsNotEmpty({ message: 'E-mail is required.' })
  @IsEmail({}, { message: 'E-mail must be valid.' })
  @Validate(ExistsRule, ['records:email:id'])
  email: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsEnum(Gender, {
    message: 'Gender must be Male, Female, or Other.',
  })
  gender?: Gender;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsString({ message: 'Address line 1 must be a string.' })
  addressLine1?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsString({ message: 'Address line 2 must be a string.' })
  addressLine2?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsString({ message: 'City must be a string.' })
  city?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
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

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @Validate(ExistsRule, ['records:mobileNumber:id'])
  @IsPhoneNumber(undefined, {
    message: 'Mobile number must be a valid phone number, including country code.',
  })
  mobileNumber?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: 'WhatsApp number must be a valid phone number, including country code.',
  })
  whatsappNumber?: string;

  @ValidateIf((_, value) => value !== '' && value !== null && value !== undefined)
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date.' })
  dateOfBirth?: string;

  @ValidateIf((o) => o.userId != null)
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsEnum(RecordStatus, {
    message: 'Status must be DRAFT or COMPLETED.',
  })
  status?: RecordStatus;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
