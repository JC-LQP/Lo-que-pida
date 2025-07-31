import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
export declare class SubscriptionsResolver {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    createSubscription(input: CreateSubscriptionInput): Promise<Subscription>;
    subscriptions(): Promise<Subscription[]>;
    subscription(id: string): Promise<Subscription>;
    updateSubscription(input: UpdateSubscriptionInput): Promise<Subscription>;
    removeSubscription(id: string): Promise<Subscription>;
}
