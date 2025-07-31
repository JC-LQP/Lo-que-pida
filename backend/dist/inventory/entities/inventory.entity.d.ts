import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Inventory {
    id: string;
    category: Category;
    products: Product[];
    stock: number;
    reservedStock: number;
    soldStock: number;
    createdAt: Date;
    updatedAt: Date;
}
