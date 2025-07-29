import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { GqlFirebaseAuthGuard } from '../auth/guards/gql-firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => LoginResponse)
  async firebaseLogin(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return this.authService.firebaseLogin(email, password);
  }

  @UseGuards(GqlFirebaseAuthGuard)
  @Mutation(() => Boolean)
  async syncUser(@CurrentUser() user: any): Promise<boolean> {
    await this.usersService.validateOrCreateUser(user);
    return true;
  }
}
