import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, User])],
  providers: [CustomersResolver, CustomersService],
})
export class CustomersModule {}
