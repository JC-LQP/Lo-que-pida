import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { AddressesResolver } from './addresses.resolver';
import { Address } from './entities/address.entity';
import { Customer } from '../customers/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Customer])],
  providers: [AddressesResolver, AddressesService],
})
export class AddressesModule {}
