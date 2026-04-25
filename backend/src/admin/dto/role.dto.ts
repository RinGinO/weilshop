import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;
}

export class UpdateRoleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;
}
