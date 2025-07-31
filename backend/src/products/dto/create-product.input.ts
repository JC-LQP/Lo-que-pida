import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProductCondition } from '../../common/enums/product-condition.enum';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field(() => ProductCondition)
  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @Field()
  @IsUUID()
  sellerId: string;
}
