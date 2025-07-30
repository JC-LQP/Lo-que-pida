import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersService } from './sellers.service';
import { SellersResolver } from './sellers.resolver';
import { Seller } from './entities/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  providers: [SellersResolver, SellersService],
})
export class SellersModule {}
