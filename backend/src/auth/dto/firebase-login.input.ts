import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FirebaseLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
