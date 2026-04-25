import {
  IsString,
  IsBoolean,
  IsUUID,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
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

  @IsUUID(undefined, { each: true })
  @IsOptional()
  @IsArray()
  relatedProductIds?: string[];

  @IsUUID(undefined, { each: true })
  @IsOptional()
  @IsArray()
  relatedTaskIds?: string[];
}

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  previewText?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsUUID()
  @IsOptional()
  coverMediaId?: string;

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

  page?: number = 1;
  limit?: number = 20;
}
