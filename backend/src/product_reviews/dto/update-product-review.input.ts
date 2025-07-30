import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateProductReviewInput } from './create-product-review.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateProductReviewInput extends PartialType(CreateProductReviewInput) {
  @Field()
  @IsUUID()
  id: string;
}
