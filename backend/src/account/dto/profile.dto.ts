import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  token: string;
}
