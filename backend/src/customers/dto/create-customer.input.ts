import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * DTO para la creación de un Customer.
 * Se requiere el ID de un usuario ya existente.
 */
@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  @IsUUID()
  userId: string;
}
