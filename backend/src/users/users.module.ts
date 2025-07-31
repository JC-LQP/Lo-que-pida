import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

/* The UsersModule class is a module in a TypeScript application that imports the TypeORM module for
User entities and provides resolver and service providers for users. */
@Module({
  imports: [TypeOrmModule.forFeature([User, Seller])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
