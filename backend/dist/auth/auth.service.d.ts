import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    validateOrCreateUser(firebaseUser: any): Promise<User>;
}
