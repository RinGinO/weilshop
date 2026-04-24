import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
  MinLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFaqItemDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  question: string;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  answer: string;

  @IsInt()
  @Min(0)
  @Max(10000)
  @IsOptional()
  sortOrder?: number = 0;

  @IsUUID()
  @IsOptional()
  relatedProductId?: string;

  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;
}

export class UpdateFaqItemDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(500)
  question?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(2000)
  answer?: string;

  @IsInt()
  @Min(0)
  @Max(10000)
  @IsOptional()
  sortOrder?: number;

  @IsUUID()
  @IsOptional()
  relatedProductId?: string;

  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class FaqQueryDto {
  @IsUUID()
  @IsOptional()
  relatedProductId?: string;

  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'sortOrder';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';

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
