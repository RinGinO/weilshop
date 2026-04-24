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

export class CreateInstructionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug: string;

  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  relatedProductId?: string;

  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;
}

export class UpdateInstructionDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

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

export class InstructionQueryDto {
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
  sortBy?: string = 'title';

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
