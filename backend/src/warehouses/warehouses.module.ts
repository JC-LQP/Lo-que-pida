import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Address } from '../addresses/entities/address.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseResolver } from './warehouse.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Seller, Address])],
  providers: [WarehouseService, WarehouseResolver],
})
export class WarehouseModule {}
