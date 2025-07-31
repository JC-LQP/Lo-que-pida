import { Repository } from 'typeorm';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { UpdateProductReviewInput } from './dto/update-product-review.input';
export declare class ProductReviewsService {
    private reviewRepo;
    constructor(reviewRepo: Repository<ProductReview>);
    create(input: CreateProductReviewInput): Promise<ProductReview>;
    findAll(): Promise<ProductReview[]>;
    findOne(id: string): Promise<ProductReview>;
    update(id: string, input: UpdateProductReviewInput): Promise<ProductReview>;
    remove(id: string): Promise<ProductReview>;
}
