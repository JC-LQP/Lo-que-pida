import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';

/* The AuthResolver class in TypeScript contains a login mutation that validates user credentials and
returns an access token. */
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    const user = await this.authService.validateUser(input.email, input.password);
    const { accessToken } = await this.authService.login(user);
    return { accessToken };
  }
}
