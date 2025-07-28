import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Subscription } from './subscription.entity';
import { CustomersResolver } from './customers.resolver';

/* The CustomersModule class is a module in TypeScript that provides functionality related to customers
and subscriptions using TypeORM. */
@Module({
  imports: [TypeOrmModule.forFeature([Customer, Subscription])],
  exports: [TypeOrmModule],
  providers: [CustomersResolver],
})
export class CustomersModule {}
