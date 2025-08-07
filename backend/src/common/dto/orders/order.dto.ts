import { IsUUID, IsEnum, IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../enums';

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  @IsOptional()
  cartId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  items?: OrderItemDto[];

  @IsUUID()
  shippingAddressId: string;

  @IsUUID()
  @IsOptional()
  billingAddressId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;
}

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID()
  @IsOptional()
  shippingAddressId?: string;

  @IsUUID()
  @IsOptional()
  billingAddressId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  cancellationReason?: string;
}

export class OrderItemResponseDto {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  
  // Related data
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    images: string[];
    seller: {
      id: string;
      businessName: string;
    };
  };

  // Computed fields
  totalPrice: number;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddressId: string;
  billingAddressId?: string;
  notes?: string;
  trackingNumber?: string;
  cancellationReason?: string;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  @Type(() => Date)
  @IsOptional()
  shippedAt?: Date;

  @Type(() => Date)
  @IsOptional()
  deliveredAt?: Date;

  // Related data
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    user: {
      email: string;
      displayName?: string;
    };
  };

  items: OrderItemResponseDto[];

  shippingAddress?: {
    recipientName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode?: string;
    phoneNumber?: string;
  };

  billingAddress?: {
    recipientName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode?: string;
    phoneNumber?: string;
  };

  // Computed fields
  itemCount: number;
  canCancel: boolean;
  canReturn: boolean;
  estimatedDeliveryDate?: Date;
}

export class OrderListResponseDto {
  orders: OrderResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class OrderFilterDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minAmount?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxAmount?: number;

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

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;
}

export class OrderStatsDto {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
}
