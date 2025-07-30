import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsService } from './carts.service';
import { CartsResolver } from './carts.resolver';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Customer, ProductVariant])],
  providers: [CartsResolver, CartsService],
})
export class CartsModule {}
