import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => String)
  @IsUUID()
  customerId: string;
}
