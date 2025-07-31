import { Seller } from '../../sellers/entities/seller.entity';
export declare enum SubscriptionPlan {
    BASIC = "basic",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise"
}
export declare enum BillingCycle {
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare enum PaidStatus {
    PAID = "paid",
    UNPAID = "unpaid"
}
export declare class Subscription {
    id: string;
    seller: Seller;
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    status: PaidStatus;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
}
