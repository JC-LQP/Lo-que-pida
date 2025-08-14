import { IsString, IsOptional, IsUUID, IsNumber, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Cart Items DTOs
 * 
 * Purpose: Define validation rules for shopping cart items
 * 
 * Why we need this:
 * 1. Ensures product IDs are valid UUIDs
 * 2. Validates quantity is a positive number
 * 3. Prevents adding invalid items to cart
 * 4. Type safety for cart operations
 */

/**
 * DTO for adding items to cart
 * Used when POST /cart-items is called
 */
export class CreateCartItemDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}

/**
 * DTO for updating cart item quantity
 * Used when PATCH /cart-items/:id is called
 */
export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity?: number;
}

/**
 * Response DTO for cart items
 */
export class CartItemResponseDto {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  
  @Type(() => Date)
  createdAt: Date;
  
  @Type(() => Date)
  updatedAt: Date;

  // Related data
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sku: string;
    isActive: boolean;
  };

  // Computed fields
  totalPrice: number;
  isAvailable: boolean;
}
