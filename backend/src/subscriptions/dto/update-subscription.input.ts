import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CreateSubscriptionInput } from './create-subscription.input';
import { SubscriptionPlan, BillingCycle, PaidStatus } from '../entities/subscription.entity';

@InputType()
export class UpdateSubscriptionInput extends PartialType(CreateSubscriptionInput) {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => SubscriptionPlan, { nullable: true })
  @IsEnum(SubscriptionPlan)
  @IsOptional()
  plan?: SubscriptionPlan;

  @Field(() => BillingCycle, { nullable: true })
  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @Field(() => PaidStatus, { nullable: true })
  @IsEnum(PaidStatus)
  @IsOptional()
  status?: PaidStatus;

  @Field(() => String, { nullable: true })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @Field(() => String, { nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
