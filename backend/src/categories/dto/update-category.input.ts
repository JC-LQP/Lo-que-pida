import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from '../entities/create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field()
  id: string;
}
