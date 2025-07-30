import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsEnum, IsNumber } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsUUID()
  customerId: string;

  @Field(() => String)
  @IsUUID()
  shippingInfoId: string;

  @Field(() => String)
  @IsUUID()
  paymentId: string;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  @IsNumber()
  total: number;
}
