import {
  IsUUID,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  MaxLength,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConsultationStatus } from '@prisma/client';

export class CreateConsultationDto {
  @IsString()
  @MaxLength(500)
  message: string;

  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  customerPhone?: string;

  @IsUUID()
  @IsOptional()
  careTaskId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  productIds?: string[];
}

export class AssignConsultationDto {
  @IsUUID()
  adminId: string;
}

export class RespondConsultationDto {
  @IsString()
  @MaxLength(2000)
  response: string;

  @IsEnum(ConsultationStatus)
  @IsOptional()
  status?: ConsultationStatus;
}

export class ConsultationQueryDto {
  @IsEnum(ConsultationStatus)
  @IsOptional()
  status?: ConsultationStatus;

  @IsUUID()
  @IsOptional()
  assignedAdminId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
