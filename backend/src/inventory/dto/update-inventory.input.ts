import { CreateInventoryInput } from './create-inventory.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateInventoryInput extends PartialType(CreateInventoryInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
