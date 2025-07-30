import { CreateSellerInput } from './create-seller.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateSellerInput extends PartialType(CreateSellerInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
