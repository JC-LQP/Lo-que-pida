import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ProductCondition } from '../../enums';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  slug: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  comparePrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  costPrice?: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  sellerId: string;

  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  dimensions?: string; // JSON string: {length, width, height}

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  trackQuantity?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  comparePrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  costPrice?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(ProductCondition)
  @IsOptional()
  condition?: ProductCondition;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  trackQuantity?: boolean;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  categoryId: string;
  sellerId: string;
  condition: ProductCondition;
  brand?: string;
  model?: string;
  weight?: number;
  dimensions?: Record<string, any>;
  images: string[];
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isFeatured: boolean;
  trackQuantity: boolean;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  category?: {
    id: string;
    name: string;
    path: string;
  };

  seller?: {
    id: string;
    businessName: string;
    logo?: string;
    rating?: number;
  };

  // Computed fields
  @Transform(({ obj }) => obj.comparePrice ? ((obj.comparePrice - obj.price) / obj.comparePrice * 100).toFixed(0) : null)
  discountPercentage?: string;

  stock?: number;
  averageRating?: number;
  reviewCount?: number;
  isInStock?: boolean;
  isOnSale?: boolean;
}

export class ProductListResponseDto {
  products: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsUUID()
  @IsOptional()
  sellerId?: string;

  @IsEnum(ProductCondition)
  @IsOptional()
  condition?: ProductCondition;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  @IsOptional()
  minRating?: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  inStock?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  onSale?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  featured?: boolean;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class BulkUpdateProductsDto {
  @IsArray()
  productIds: string[];

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsArray()
  @IsOptional()
  tags?: string[];
}