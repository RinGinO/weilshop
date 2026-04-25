import {
  IsUUID,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestStatus } from '@prisma/client';

export class CreateRequestOrderDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  comment?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  customerName?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  customerEmail?: string;

  @IsUUID()
  @IsOptional()
  deliveryMethodId?: string;

  @IsUUID()
  @IsOptional()
  paymentMethodId?: string;
}

export class AddRequestItemDto {
  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  quantity: number;
}

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  notifyCustomer?: boolean = false;
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
