import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { UsersService } from '../users/users.service';
export declare class AuthResolver {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    firebaseLogin(email: string, password: string): Promise<LoginResponse>;
    syncUser(user: any): Promise<boolean>;
}
