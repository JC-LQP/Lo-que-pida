import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Inventory } from './entities/inventory.entity';

/* The ProductsModule class is a module in TypeScript that imports and exports TypeORM modules for
Product, ProductImage, and Inventory entities. */
@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Inventory])],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
