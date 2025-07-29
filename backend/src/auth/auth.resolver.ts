import { Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlFirebaseAuthGuard } from '../auth/guards/gql-firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GqlFirebaseAuthGuard)
  @Mutation(() => Boolean)
  async syncUser(@CurrentUser() user: any): Promise<boolean> {
    await this.usersService.validateOrCreateUser(user);
    return true;
  }
}
