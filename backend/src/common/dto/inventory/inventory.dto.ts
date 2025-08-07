import { IsUUID, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  warehouseId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  reservedQuantity?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  reorderLevel?: number;
}

export class UpdateInventoryDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  reservedQuantity?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  reorderLevel?: number;
}

export class InventoryAdjustmentDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  @IsOptional()
  warehouseId?: string;

  @IsNumber()
  @Type(() => Number)
  adjustment: number; // Positive for increase, negative for decrease

  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class InventoryResponseDto {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  product?: {
    id: string;
    name: string;
    sku: string;
  };

  warehouse?: {
    id: string;
    name: string;
    location: string;
  };

  // Computed fields
  availableQuantity: number;
  needsReorder: boolean;
}
