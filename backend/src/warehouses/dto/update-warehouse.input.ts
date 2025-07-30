import { CreateWarehouseInput } from './create-warehouse.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseInput extends PartialType(CreateWarehouseInput) {
  @Field()
  id: string;
}
