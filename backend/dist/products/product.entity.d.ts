import { Seller } from '../sellers/seller.entity';
export declare enum ProductCondition {
    NEW = "new",
    USED = "used"
}
export declare class Product {
    id: string;
    seller: Seller;
    name: string;
    description: string;
    condition: ProductCondition;
    category: string;
    approved: boolean;
    createdAt: Date;
}
