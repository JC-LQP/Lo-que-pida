import { IsString, IsOptional, IsUUID, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Shipping Info DTOs
 * 
 * Purpose: Define validation rules for shipping tracking and logistics
 * 
 * Why we need this:
 * 1. Validates shipping status values
 * 2. Ensures proper date formats for delivery estimates
 * 3. Validates tracking numbers and costs
 * 4. Type safety for shipping operations
 */

// Enum for shipping status
export enum ShippingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED'
}

/**
 * DTO for creating shipping information
 * Used when POST /shipping-info is called
 */
export class CreateShippingInfoDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  warehouseId: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  carrier: string; // e.g., "FedEx", "UPS", "DHL"

  @IsEnum(ShippingStatus)
  @IsOptional()
  status?: ShippingStatus = ShippingStatus.PENDING;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  shippingCost: number;

  @IsDateString()
  @IsOptional()
  estimatedDeliveryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  weight?: number; // in kg

  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

/**
 * DTO for updating shipping information
 * Used when PATCH /shipping-info/:id is called
 */
export class UpdateShippingInfoDto {
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsEnum(ShippingStatus)
  @IsOptional()
  status?: ShippingStatus;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  shippingCost?: number;

  @IsDateString()
  @IsOptional()
  estimatedDeliveryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  weight?: number;

  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

/**
 * Response DTO for shipping information
 */
export class ShippingInfoResponseDto {
  id: string;
  orderId: string;
  warehouseId: string;
  trackingNumber?: string;
  carrier: string;
  status: ShippingStatus;
  shippingCost: number;
  estimatedDeliveryDate?: Date;
  notes?: string;
  weight?: number;
  dimensions?: any;
  
  @Type(() => Date)
  createdAt: Date;
  
  @Type(() => Date)
  updatedAt: Date;
  
  @Type(() => Date)
  shippedAt?: Date;
  
  @Type(() => Date)
  deliveredAt?: Date;

  // Related data
  order?: {
    orderNumber: string;
    totalAmount: number;
    customer?: {
      user?: {
        displayName: string;
        email: string;
      };
    };
  };

  warehouse?: {
    name: string;
    location: string;
    address: string;
  };

  // Computed fields
  isPending: boolean;
  isProcessing: boolean;
  isShipped: boolean;
  isInTransit: boolean;
  isDelivered: boolean;
  isReturned: boolean;
  daysSinceShipped?: number;
  estimatedDeliveryDays?: number;
}
