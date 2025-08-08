import { IsUUID, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShippingInfoDto {
  @IsUUID()
  orderId: string;

  @IsString()
  carrier: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  estimatedDelivery?: string; // ISO date string
}

export class UpdateShippingInfoDto {
  @IsString()
  @IsOptional()
  carrier?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  estimatedDelivery?: string;

  @IsString()
  @IsOptional()
  actualDelivery?: string;
}

export class ShippingInfoResponseDto {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber?: string;
  method?: string;
  cost?: number;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  order?: {
    id: string;
    orderNumber: string;
    status: string;
  };
}