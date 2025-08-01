import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';

@InputType()
export class CreateInventoryInput {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  productId?: string;

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
