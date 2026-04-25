import { IsString, IsBoolean, IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateInstructionDto {
  @IsString()
  title: string;

  @IsString()
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
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class InstructionQueryDto {
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsUUID()
  @IsOptional()
  relatedProductId?: string;

  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  page?: number = 1;
  limit?: number = 20;
}

export class CreateFaqDto {
  @IsString()
  question: string;

  @IsString()
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

export class UpdateFaqDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsInt()
  @Min(0)
  @Max(10000)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class FaqQueryDto {
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsUUID()
  @IsOptional()
  relatedProductId?: string;

  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  page?: number = 1;
  limit?: number = 20;
}
