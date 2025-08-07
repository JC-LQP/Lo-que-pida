import { IsUUID, IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionPlan, BillingCycle, SubscriptionStatus } from '../../enums';

export class CreateSubscriptionDto {
  @IsUUID()
  customerId: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  @IsOptional()
  plan?: SubscriptionPlan;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsString()
  @IsOptional()
  endDate?: string;
}

export class SubscriptionResponseDto {
  id: string;
  customerId: string;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  price: number;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  // Related data
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    user: {
      email: string;
    };
  };

  // Computed fields
  isActive: boolean;
  daysRemaining?: number;
  nextBillingDate?: Date;
}
