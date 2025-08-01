import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Seller } from '../sellers/entities/seller.entity';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): Promise<User>;
    findAll(user: any): Promise<User[]>;
    findOne(id: string): Promise<User>;
    me(user: any): Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): Promise<User>;
    removeUser(id: string): Promise<User>;
    seller(user: User): Promise<Seller | null>;
}
