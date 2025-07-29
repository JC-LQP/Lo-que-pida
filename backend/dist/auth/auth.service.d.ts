import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './dto/login-response';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly httpService;
    private readonly configService;
    private readonly usersService;
    constructor(httpService: HttpService, configService: ConfigService, usersService: UsersService);
    firebaseLogin(email: string, password: string): Promise<LoginResponse>;
    validateOrCreateUser(firebaseUser: any): Promise<User>;
}
