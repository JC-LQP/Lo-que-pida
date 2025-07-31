import { CreateSubscriptionInput } from './create-subscription.input';
import { SubscriptionPlan, BillingCycle, PaidStatus } from '../entities/subscription.entity';
declare const UpdateSubscriptionInput_base: import("@nestjs/common").Type<Partial<CreateSubscriptionInput>>;
export declare class UpdateSubscriptionInput extends UpdateSubscriptionInput_base {
    id: string;
    plan?: SubscriptionPlan;
    billingCycle?: BillingCycle;
    status?: PaidStatus;
    startDate?: Date;
    endDate?: Date;
}
export {};
