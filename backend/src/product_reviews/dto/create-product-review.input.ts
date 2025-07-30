import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min, Max, IsUUID, IsString } from 'class-validator';

@InputType()
export class CreateProductReviewInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field()
  @IsString()
  comment: string;

  @Field()
  @IsUUID()
  productId: string;

  @Field()
  @IsUUID()
  userId: string;
}
