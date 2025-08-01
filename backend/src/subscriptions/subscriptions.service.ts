import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async create(input: CreateSubscriptionInput): Promise<Subscription> {
    const seller = await this.sellerRepository.findOne({ where: { id: input.sellerId } });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${input.sellerId} not found`);
    }

    const subscription = this.subscriptionRepository.create({
      ...input,
      seller,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });
    return this.subscriptionRepository.save(subscription);
  }

  findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({ relations: ['seller'] });
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async update(input: UpdateSubscriptionInput): Promise<Subscription> {
    const subscription = await this.findOne(input.id);
    Object.assign(subscription, input);
    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    return this.subscriptionRepository.remove(subscription);
  }
}
