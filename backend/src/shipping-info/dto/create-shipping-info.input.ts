import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';

@InputType()
export class CreateShippingInfoInput {
  @Field()
  @IsUUID()
  orderId: string;

  @Field()
  @IsUUID()
  addressId: string;

  @Field()
  @IsString()
  shippingMethod: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  carrierName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: Date;
}
