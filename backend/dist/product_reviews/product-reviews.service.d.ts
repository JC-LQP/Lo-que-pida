import { Repository } from 'typeorm';
import { ProductReview } from './entities/product-review.entity';
import { CreateProductReviewInput } from './dto/create-product-review.input';
import { UpdateProductReviewInput } from './dto/update-product-review.input';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
export declare class ProductReviewsService {
    private reviewRepo;
    private userRepo;
    private productRepo;
    constructor(reviewRepo: Repository<ProductReview>, userRepo: Repository<User>, productRepo: Repository<Product>);
    create(input: CreateProductReviewInput): Promise<ProductReview>;
    findAll(): Promise<ProductReview[]>;
    findOne(id: string): Promise<ProductReview>;
    update(id: string, input: UpdateProductReviewInput): Promise<ProductReview>;
    remove(id: string): Promise<ProductReview>;
}
