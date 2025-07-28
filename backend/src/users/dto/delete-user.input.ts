import { InputType, Field, ID } from '@nestjs/graphql';

/* The `DeleteUserInput` class in TypeScript is decorated with `@InputType()` and contains a field `id`
of type `ID`. */
@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  id: string;
}
