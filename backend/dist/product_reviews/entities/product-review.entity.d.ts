import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class ProductReview {
    id: string;
    user: User;
    product: Product;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
