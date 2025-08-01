import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
export declare class SubscriptionsService {
    private readonly subscriptionRepository;
    private readonly sellerRepository;
    constructor(subscriptionRepository: Repository<Subscription>, sellerRepository: Repository<Seller>);
    create(input: CreateSubscriptionInput): Promise<Subscription>;
    findAll(): Promise<Subscription[]>;
    findOne(id: string): Promise<Subscription>;
    update(input: UpdateSubscriptionInput): Promise<Subscription>;
    remove(id: string): Promise<Subscription>;
}
