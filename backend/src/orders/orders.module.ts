import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { Order } from './entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { ShippingInfo } from '../shipping-info/entities/shipping-info.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, ShippingInfo, Payment])],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
