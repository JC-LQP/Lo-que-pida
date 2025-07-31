import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
export declare class InventoryResolver {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createInventory(input: CreateInventoryInput): Promise<Inventory>;
    findAllInventory(): Promise<Inventory[]>;
    findOneInventory(id: string): Promise<Inventory>;
    updateInventory(id: string, input: UpdateInventoryInput): Promise<Inventory>;
    removeInventory(id: string): Promise<boolean>;
}
