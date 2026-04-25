import { IsString, IsEnum, IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ConsultationStatus } from '@prisma/client';

export class UpdateConsultationDto {
  @IsEnum(ConsultationStatus)
  @IsOptional()
  status?: ConsultationStatus;

  @IsString()
  @IsOptional()
  response?: string;

  @IsUUID()
  @IsOptional()
  assignedAdminId?: string;
}

export class AssignConsultationDto {
  @IsUUID()
  assignedAdminId: string;
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
  careTaskId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  page?: number = 1;
  limit?: number = 20;
}
