import { UserRole } from '../user.entity';
export declare class CreateUserInput {
    email: string;
    password: string;
    fullName?: string;
    role: UserRole;
}
