import { InputType, Field, Float, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProductCondition } from '../../../common/enums/product-condition.enum';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  sellerId?: string;

  @Field(() => ProductCondition, { nullable: true })
  @IsEnum(ProductCondition)
  @IsOptional()
  condition?: ProductCondition;
}
