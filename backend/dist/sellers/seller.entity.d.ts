import { User } from '../users/entities/user.entity';
export declare enum SellerSubscription {
    LOCAL = "local",
    REGIONAL = "regional",
    NATIONAL = "national",
    INTERNATIONAL = "international"
}
export declare enum SellerStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Seller {
    id: string;
    user: User;
    storeName: string;
    taxId?: string;
    phoneNumber?: string;
    subscription?: SellerSubscription;
    status: SellerStatus;
}
