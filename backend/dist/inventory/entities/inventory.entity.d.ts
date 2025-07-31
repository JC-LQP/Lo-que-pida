import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Inventory {
    id: string;
    category: Category;
    product: Product[];
    stock: number;
    reservedStock: number;
    soldStock: number;
    createdAt: Date;
    updatedAt: Date;
}
