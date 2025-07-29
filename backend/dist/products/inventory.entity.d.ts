import { Product } from './product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
export declare class Inventory {
    productId: string;
    warehouseId: string;
    product: Product;
    warehouse: Warehouse;
    quantity: number;
}
