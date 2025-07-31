import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product } from './entities/product.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { ProductReview } from '../product_reviews/entities/product-review.entity';
import { Seller } from '../sellers/entities/seller.entity';

@Module({
imports: [TypeOrmModule.forFeature([Product, OrderItem, Inventory, ProductReview, Seller])],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
