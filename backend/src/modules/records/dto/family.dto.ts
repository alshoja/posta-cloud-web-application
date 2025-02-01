import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateFamilyDto {
  @ValidateIf((o) => o.marriageDate != '')
  @IsOptional()
  @IsDateString({}, { message: 'Marriage date must be a valid date.' })
  marriageDate: string;

  @IsOptional()
  @IsString({ message: 'Previous address must be a string.' })
  previousAddress: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children: ChildDto[];
}

export class ChildDto {
  @IsNotEmpty({ message: 'Child name is required.' })
  @IsString({ message: 'Child name must be a string.' })
  name: string;

  @IsNotEmpty({ message: 'Date of birth is required.' })
  @IsDateString({}, { message: 'Date of birth must be a valid date.' })
  dateOfBirth: string;

  @IsNotEmpty({ message: 'Gender is required.' })
  @IsEnum(Gender, {
    message: 'Gender must be Male, Female, or Other.',
  })
  gender: Gender;
}

export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {}
