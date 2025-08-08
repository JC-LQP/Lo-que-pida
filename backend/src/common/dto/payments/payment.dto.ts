import { IsUUID, IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentProvider, PaymentStatus } from '../../enums';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  metadata?: string; // JSON string
}

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  metadata?: string;

  @IsString()
  @IsOptional()
  failureReason?: string;
}

export class PaymentResponseDto {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  status: PaymentStatus;
  paymentMethodId?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  failureReason?: string;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  @Type(() => Date)
  @IsOptional()
  paidAt?: Date;

  // Related data
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: number;
  };
}

export class PaymentIntentDto {
  @IsUUID()
  orderId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsString()
  @IsOptional()
  returnUrl?: string;
}

export class PaymentWebhookDto {
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsString()
  payload: string;

  @IsString()
  signature: string;
}