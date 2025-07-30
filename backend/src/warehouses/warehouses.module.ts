import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseResolver } from './warehouse.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  providers: [WarehouseService, WarehouseResolver],
})
export class WarehouseModule {}
