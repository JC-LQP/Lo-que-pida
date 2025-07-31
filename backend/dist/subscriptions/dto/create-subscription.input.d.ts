import { SubscriptionPlan, BillingCycle } from '../entities/subscription.entity';
export declare class CreateSubscriptionInput {
    sellerId: string;
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    startDate: Date;
    endDate: Date;
}
