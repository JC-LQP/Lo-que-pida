import { Seller } from '../../sellers/entities/seller.entity';
import { ProductReview } from '../../product_reviews/entities/product-review.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { ProductCondition } from '../../common/enums/product-condition.enum';
export declare class Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    condition: ProductCondition;
    seller: Seller;
    reviews?: ProductReview[];
    inventory?: Inventory;
    orderItems?: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
