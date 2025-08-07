import { IsUUID, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  customerId: string;

  @IsUUID()
  @IsOptional()
  orderId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  images?: string; // JSON array of image URLs
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  images?: string;
}

export class ReviewResponseDto {
  id: string;
  productId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    user: {
      displayName?: string;
    };
  };

  product?: {
    id: string;
    name: string;
    slug: string;
  };

  // Computed fields
  customerName: string;
  isVerifiedPurchase: boolean;
}
