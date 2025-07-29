import { UserRole } from '../entities/user.entity';
export declare class CreateUserInput {
    email: string;
    fullName?: string;
    role?: UserRole;
    profileImage?: string;
    firebaseUid?: string;
}
