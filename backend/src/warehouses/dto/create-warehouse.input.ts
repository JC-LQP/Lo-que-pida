import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field()
  sellerId: string;

  @Field()
  addressId: string;

  @Field()
  name: string;
}
