import { IsEmail, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @IsEmail({}, { message: 'Username must be a valid email address' })
  @MaxLength(254, { message: 'Username must not exceed 254 characters' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  password: string;
}
