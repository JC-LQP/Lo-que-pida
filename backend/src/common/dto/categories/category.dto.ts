import { IsString, IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  sortOrder?: number;
}

export class CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Nested category data
  parent?: CategoryResponseDto;
  children?: CategoryResponseDto[];
  
  // Computed fields
  level: number;
  path: string; // e.g., "Electronics > Phones > Samsung"
  productCount?: number;
}

export class CategoryTreeResponseDto {
  id: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  sortOrder: number;
  level: number;
  productCount: number;
  children: CategoryTreeResponseDto[];
}

export class CategoryListResponseDto {
  categories: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CategoryFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  level?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class MoveCategoryDto {
  @IsUUID()
  @IsOptional()
  newParentId?: string; // null to move to root

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  newSortOrder?: number;
}
