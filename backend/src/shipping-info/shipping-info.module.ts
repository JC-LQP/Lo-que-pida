import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingInfoService } from './shipping-info.service';
import { ShippingInfoResolver } from './shipping-info.resolver';
import { ShippingInfo } from './entities/shipping-info.entity';
import { Order } from '../orders/entities/order.entity';
import { Address } from '../addresses/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingInfo, Order, Address])],
  providers: [ShippingInfoResolver, ShippingInfoService],
})
export class ShippingInfoModule {}
