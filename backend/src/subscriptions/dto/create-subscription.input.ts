import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { SubscriptionPlan, BillingCycle } from '../entities/subscription.entity';

@InputType()
export class CreateSubscriptionInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  sellerId: string;

  @Field(() => SubscriptionPlan)
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @Field(() => BillingCycle)
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @Field(() => String)
  @IsDateString()
  startDate: Date;

  @Field(() => String)
  @IsDateString()
  endDate: Date;
}
