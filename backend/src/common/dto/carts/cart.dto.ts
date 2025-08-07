import { IsUUID, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartDto {
  @IsUUID()
  customerId: string;
}

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  quantity: number;
}

export class RemoveFromCartDto {
  @IsUUID()
  cartItemId: string;
}

export class CartItemResponseDto {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  
  // Related data
  product?: {
    id: string;
    name: string;
    price: number;
    comparePrice?: number;
    images: string[];
    slug: string;
    sku: string;
    isActive: boolean;
    stock?: number;
    seller: {
      id: string;
      businessName: string;
    };
  };

  // Computed fields
  unitPrice: number;
  totalPrice: number;
  isAvailable: boolean;
  maxQuantityAllowed: number;
}

export class CartResponseDto {
  id: string;
  customerId: string;
  
  @Type(() => Date)
  created_at: Date;

  // Cart items
  items: CartItemResponseDto[];

  // Computed totals
  itemCount: number;
  subtotal: number;
  totalSavings: number;
  estimatedShipping: number;
  estimatedTax: number;
  total: number;

  // Validation
  hasOutOfStockItems: boolean;
  hasUnavailableItems: boolean;
  isValid: boolean;
}

export class CartSummaryDto {
  itemCount: number;
  subtotal: number;
  totalSavings: number;
  estimatedShipping: number;
  estimatedTax: number;
  total: number;
}

export class MergeCartsDto {
  @IsUUID()
  sourceCartId: string;

  @IsUUID()
  targetCartId: string;
}

export class ClearCartDto {
  @IsUUID()
  cartId: string;
}

export class CartValidationResponseDto {
  isValid: boolean;
  errors: {
    itemId: string;
    productName: string;
    error: string;
    suggestion?: string;
  }[];
  warnings: {
    itemId: string;
    productName: string;
    warning: string;
  }[];
}
