import { IsString, IsOptional, IsUUID, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string; // YYYY-MM-DD format

  @IsString()
  @IsOptional()
  preferences?: string; // JSON string for customer preferences
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  preferences?: string;
}

export class CustomerResponseDto {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  preferences?: Record<string, any>;
  
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
  fullName?: string;
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
}

export class CustomerListResponseDto {
  customers: CustomerResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CustomerFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class CustomerStatsDto {
  totalCustomers: number;
  newCustomersThisMonth: number;
  averageOrderValue: number;
  topCustomers: {
    id: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }[];
}
