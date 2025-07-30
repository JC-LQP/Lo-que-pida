import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from './entities/product-review.entity';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsResolver } from './product-reviews.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview])],
  providers: [ProductReviewsService, ProductReviewsResolver],
})
export class ProductReviewsModule {}
