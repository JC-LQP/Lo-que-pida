import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { Subscription } from './entities/subscription.entity';
import { Seller } from '../sellers/entities/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Seller])],
  providers: [SubscriptionsService, SubscriptionsResolver],
})
export class SubscriptionsModule {}
