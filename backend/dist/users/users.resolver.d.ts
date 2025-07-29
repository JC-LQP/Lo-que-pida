import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): Promise<import("./user.entity").User>;
    findAll(user: any): Promise<import("./user.entity").User[]>;
    findOne(id: number): any;
    updateUser(updateUserInput: UpdateUserInput): any;
    removeUser(id: number): any;
}
