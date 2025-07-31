import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Product } from '../../products/entities/product.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
export declare enum SellerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned"
}
export declare class Seller {
    id: string;
    user: User;
    storeName: string;
    storeDescription?: string;
    storeLogo?: string;
    subscription?: Subscription;
    status: SellerStatus;
    createdAt: Date;
    products: Product[];
    warehouses: Warehouse[];
}
