import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * DTO para la actualización de un Customer.
 * Permite modificar el userId (aunque usualmente no se cambia).
 */
@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
