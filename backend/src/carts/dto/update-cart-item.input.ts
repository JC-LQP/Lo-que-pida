import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, Min } from 'class-validator';

@InputType()
export class UpdateCartItemInput {
  @Field(() => String)
  @IsUUID()
  itemId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}
