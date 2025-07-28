import { ObjectType, Field, ID } from '@nestjs/graphql';

/* The Customer class is defined with fields for id, fullName, email, and an optional phoneNumber. */
@ObjectType()
export class Customer {
  @Field(() => ID)
  id: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}
