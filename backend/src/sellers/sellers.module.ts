import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersService } from './sellers.service';
import { SellersResolver } from './sellers.resolver';
import { Seller } from './entities/seller.entity';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Product } from '../products/entities/product.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';

@Module({
imports: [TypeOrmModule.forFeature([Seller, User, Subscription, Product, Warehouse])],
  providers: [SellersResolver, SellersService],
})
export class SellersModule {}
