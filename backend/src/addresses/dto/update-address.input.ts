import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateAddressInput } from './create-address.input';

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  @Field()
  id: string;
}
