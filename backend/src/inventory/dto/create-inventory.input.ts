import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, Min } from 'class-validator';

@InputType()
export class CreateInventoryInput {
  @Field(() => String)
  @IsUUID()
  productId: string;

  @Field(() => String)
  @IsUUID()
  categoryId: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  stock: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  reservedStock?: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  soldStock?: number;
}
