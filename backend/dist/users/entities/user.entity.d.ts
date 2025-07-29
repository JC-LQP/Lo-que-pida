export declare enum UserRole {
    CUSTOMER = "customer",
    SELLER = "seller",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    fullName?: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: Date;
    firebaseUid?: string;
    profileImage?: string;
}
