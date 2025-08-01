import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from './entities/product-review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsResolver } from './product-reviews.resolver';

@Module({
imports: [TypeOrmModule.forFeature([ProductReview, Product, User])],
  providers: [ProductReviewsService, ProductReviewsResolver],
})
export class ProductReviewsModule {}
