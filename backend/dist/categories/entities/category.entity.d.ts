import { Inventory } from '../../inventory/entities/inventory.entity';
export declare class Category {
    id: string;
    name: string;
    description?: string;
    parent?: Category;
    children?: Category[];
    inventoryItems?: Inventory[];
}
