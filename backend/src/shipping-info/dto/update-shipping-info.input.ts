import { CreateShippingInfoInput } from './create-shipping-info.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateShippingInfoInput extends PartialType(CreateShippingInfoInput) {
  @Field()
  @IsUUID()
  id: string;
}
