import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Mutation(() => Subscription)
  createSubscription(@Args('input') input: CreateSubscriptionInput): Promise<Subscription> {
    return this.subscriptionsService.create(input);
  }

  @Query(() => [Subscription])
  subscriptions(): Promise<Subscription[]> {
    return this.subscriptionsService.findAll();
  }

  @Query(() => Subscription)
  subscription(@Args('id', { type: () => String }) id: string): Promise<Subscription> {
    return this.subscriptionsService.findOne(id);
  }

  @Mutation(() => Subscription)
  updateSubscription(@Args('input') input: UpdateSubscriptionInput): Promise<Subscription> {
    return this.subscriptionsService.update(input);
  }

  @Mutation(() => Subscription)
  removeSubscription(@Args('id', { type: () => String }) id: string): Promise<Subscription> {
    return this.subscriptionsService.remove(id);
  }
}
