import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AdminStatus } from '@prisma/client';

export class CreateAdminDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  roleIds?: string[];
}

export class UpdateAdminDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(AdminStatus)
  @IsOptional()
  status?: AdminStatus;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  roleIds?: string[];
}

export class ChangeAdminPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class AdminQueryDto {
  @IsEnum(AdminStatus)
  @IsOptional()
  status?: AdminStatus;

  @IsString()
  @IsOptional()
  search?: string;

  page?: number = 1;
  limit?: number = 20;
}
