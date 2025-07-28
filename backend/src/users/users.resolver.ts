import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { DeleteUserInput } from './dto/delete-user.input';


/* The UsersResolver class in TypeScript defines resolver methods for querying and mutating user data. */
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): Promise<User> {
  return this.usersService.create(input);
  }

    @Mutation(() => Boolean)
  async deleteUser(
    @Args('input') input: DeleteUserInput,
  ): Promise<boolean> {
    return this.usersService.deleteUser(input.id);
  }
}
