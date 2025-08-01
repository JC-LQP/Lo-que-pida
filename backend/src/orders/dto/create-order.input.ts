import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsUUID()
  customerId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  shippingInfoId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  paymentId?: string;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  @IsNumber()
  total: number;
}
