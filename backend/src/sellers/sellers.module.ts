import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './seller.entity';

/* The SellersModule class is a module in TypeScript that imports the Seller entity using TypeORM. */
@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  exports: [TypeOrmModule],
})
export class SellersModule {}
