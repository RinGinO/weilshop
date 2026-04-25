import { IsString, IsEnum, IsUUID, IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class UpdateRequestDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @IsString()
  @IsOptional()
  adminComment?: string;
}

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  newStatus: RequestStatus;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class RequestQueryDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

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

  page?: number = 1;
  limit?: number = 20;
}

export class AddRequestItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  quantity: number;
}
