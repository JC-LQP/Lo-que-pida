import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsService } from './carts.service';
import { CartsResolver } from './carts.resolver';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { ProductsModule } from '../products/products.module';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Customer, Product]), ProductsModule],
  providers: [CartsResolver, CartsService],
})
export class CartsModule {}
