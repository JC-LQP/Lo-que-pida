import { IsString, IsOptional, IsBoolean, IsNumber, Min, MaxLength, MinLength, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Warehouses DTOs
 * 
 * Purpose: Define validation rules for warehouse management
 * 
 * Why we need this:
 * 1. Validates warehouse names and addresses
 * 2. Ensures capacity is a positive number
 * 3. Validates contact information
 * 4. Type safety for warehouse operations
 */

/**
 * DTO for creating a new warehouse
 * Used when POST /warehouses is called
 */
export class CreateWarehouseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  address: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  province: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  country: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  contactInfo?: string;
}

/**
 * DTO for updating warehouse information
 * Used when PATCH /warehouses/:id is called
 */
export class UpdateWarehouseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsOptional()
  address?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  city?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  province?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  country?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  postalCode?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  contactInfo?: string;
}

/**
 * Response DTO for warehouse information
 */
export class WarehouseResponseDto {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  isActive: boolean;
  description?: string;
  contactInfo?: string;
  
  @Type(() => Date)
  createdAt: Date;
  
  @Type(() => Date)
  updatedAt: Date;

  // Computed fields
  utilization?: string;
  availableCapacity?: number;
  hasInventory: boolean;
  hasActiveShipments: boolean;
}
