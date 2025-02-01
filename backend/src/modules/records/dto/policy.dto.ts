import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePolicyDto {
  @IsNotEmpty({ message: 'Policy type is required.' })
  @IsString({ message: 'Policy type must be a string.' })
  type: string;

  @IsNotEmpty({ message: 'Policy number is required.' })
  @Matches(/^[A-Z0-9]{8,12}$/, {
    message: 'Policy number must be 8-12 alphanumeric characters.',
  })
  number: string;
}

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {}
