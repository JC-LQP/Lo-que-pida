import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';

/* The CartModule class is a TypeScript module that imports and exports TypeOrmModule with Cart and
CartItem entities. */
@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  exports: [TypeOrmModule],
})
export class CartModule {}
