import { UsersService } from '../users/users.service';
export declare class AuthResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    syncUser(user: any): Promise<boolean>;
}
