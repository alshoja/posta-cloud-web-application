import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { Gender } from '../enums/gender.enum';

export class CreateProfileDto {
  @ValidateIf((o) => o.id != '')
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  // @IsUrl({ require_tld: false })
  profileImage: string;

  @IsNotEmpty({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a string.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a string.' })
  lastName: string;

  @IsEmail({}, { message: 'E-mail must be valid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @Validate(ExistsRule, ['records:email:id'])
  email: string;

  @IsNotEmpty({ message: 'Gender is required.' })
  @IsEnum(Gender, {
    message: 'Gender must be Male, Female, or Other.',
  })
  gender: Gender;

  @IsNotEmpty({ message: 'House name is required.' })
  @IsString({ message: 'House name must be a string.' })
  houseName: string;

  @IsOptional()
  @IsString({ message: 'House number must be a string.' })
  houseNumber: string;

  @IsNotEmpty({ message: 'Street name is required.' })
  @IsString({ message: 'Street name must be a string.' })
  streetName: string;

  @IsNotEmpty({ message: 'Street number  is required.' })
  @IsString({ message: 'Street number must be a string.' })
  streetNumber: string;

  @IsNotEmpty({ message: 'Post office is required.' })
  @Min(100000, { message: 'PostOffice Number must be 6 digit ' })
  @Max(999999, { message: 'PostOffice Number must be 6 digit ' })
  @IsNumber()
  postOffice: number;

  @IsNotEmpty({ message: 'Panchayath is required.' })
  @IsString({ message: 'Panchayath must be a string.' })
  panchayat: string;

  @IsNotEmpty({ message: 'District is required.' })
  @IsString({ message: 'District must be a string.' })
  district: string;

  @IsNotEmpty({ message: 'Mobile number is required.' })
  @Validate(ExistsRule, ['records:mobileNumber:id'])
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits.' })
  mobileNumber: string;

  @ValidateIf((o) => o.whatsappNumber != '')
  @IsOptional()
  whatsappNumber?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string.' })
  village?: string;

  @IsNotEmpty({ message: 'Date of Birth is required.' })
  @IsDateString({}, { message: 'Date of birth must be a valid date.' })
  dateOfBirth?: string;

  @ValidateIf((o) => o.userId != null)
  @IsOptional()
  @IsNumber()
  userId?: number;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
