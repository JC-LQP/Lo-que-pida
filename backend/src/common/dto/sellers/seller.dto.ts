import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { SellerStatus } from '../../enums';

export class CreateSellerDto {
  @IsUUID()
  userId: string;

  @IsString()
  businessName: string;

  @IsString()
  @IsOptional()
  businessDescription?: string;

  @IsString()
  @IsOptional()
  businessAddress?: string;

  @IsString()
  @IsOptional()
  businessPhone?: string;

  @IsString()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsEnum(SellerStatus)
  @IsOptional()
  status?: SellerStatus;
}

export class UpdateSellerDto {
  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  businessDescription?: string;

  @IsString()
  @IsOptional()
  businessAddress?: string;

  @IsString()
  @IsOptional()
  businessPhone?: string;

  @IsString()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsEnum(SellerStatus)
  @IsOptional()
  status?: SellerStatus;
}

export class SellerResponseDto {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  taxId?: string;
  logo?: string;
  website?: string;
  status: SellerStatus;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  user?: {
    id: string;
    email: string;
    displayName?: string;
    avatar?: string;
  };

  // Computed fields
  totalProducts?: number;
  totalSales?: number;
  averageRating?: number;
  totalReviews?: number;
  isVerified?: boolean;
}

export class SellerListResponseDto {
  sellers: SellerResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SellerFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(SellerStatus)
  @IsOptional()
  status?: SellerStatus;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  @IsOptional()
  minRating?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class SellerStatsDto {
  totalSellers: number;
  activeSellers: number;
  newSellersThisMonth: number;
  averageSellerRating: number;
  topSellers: {
    id: string;
    businessName: string;
    totalSales: number;
    productCount: number;
    rating: number;
  }[];
}

export class SellerStatusUpdateDto {
  @IsEnum(SellerStatus)
  status: SellerStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
