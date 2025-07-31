import { ProductReviewsService } from './product-reviews.service';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { UpdateProductReviewInput } from './dto/update-product-review.input';
export declare class ProductReviewsResolver {
    private readonly service;
    constructor(service: ProductReviewsService);
    createProductReview(input: CreateProductReviewInput): Promise<ProductReview>;
    findAll(): Promise<ProductReview[]>;
    findOne(id: string): Promise<ProductReview>;
    updateProductReview(input: UpdateProductReviewInput): Promise<ProductReview>;
    removeProductReview(id: string): Promise<ProductReview>;
}
