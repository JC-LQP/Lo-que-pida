import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, Min } from 'class-validator';

@InputType()
export class AddItemToCartInput {
  @Field(() => String)
  @IsUUID()
  cartId: string;

  @Field(() => String)
  @IsUUID()
  productVariantId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}
