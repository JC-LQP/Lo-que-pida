import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserInput } from './dto/create-user.input';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
}
