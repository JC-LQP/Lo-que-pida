import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { UpdateProductReviewInput } from './dto/update-product-review.input';

@Resolver(() => ProductReview)
export class ProductReviewsResolver {
  constructor(private readonly service: ProductReviewsService) {}

  @Mutation(() => ProductReview)
  createProductReview(@Args('input') input: CreateProductReviewInput) {
    return this.service.create(input);
  }

  @Query(() => [ProductReview], { name: 'productReviews' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => ProductReview, { name: 'productReview' })
  findOne(@Args('id') id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => ProductReview)
  updateProductReview(@Args('input') input: UpdateProductReviewInput) {
    return this.service.update(input.id, input);
  }

  @Mutation(() => ProductReview)
  removeProductReview(@Args('id') id: string) {
    return this.service.remove(id);
  }
}
