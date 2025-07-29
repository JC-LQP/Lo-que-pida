import { Customer } from '../customers/customer.entity';
import { Product } from '../products/product.entity';
export declare class Review {
    id: string;
    customer: Customer;
    product: Product;
    rating: number;
    comment: string;
    createdAt: Date;
}
