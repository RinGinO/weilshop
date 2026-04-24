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

export class CreateArticleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  previewText?: string;

  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  coverMediaId?: string;

  @IsUUID()
  @IsOptional()
  authorId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;
}

export class UpdateArticleDto {
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
  @MaxLength(500)
  previewText?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsUUID()
  @IsOptional()
  coverMediaId?: string;

  @IsUUID()
  @IsOptional()
  authorId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class ArticleQueryDto {
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsUUID()
  @IsOptional()
  authorId?: string;

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
