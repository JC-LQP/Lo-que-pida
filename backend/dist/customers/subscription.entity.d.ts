import { Customer } from './customer.entity';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    CANCELLED = "cancelled"
}
export declare class Subscription {
    id: string;
    customer: Customer;
    status: SubscriptionStatus;
    expiresAt: Date;
}
