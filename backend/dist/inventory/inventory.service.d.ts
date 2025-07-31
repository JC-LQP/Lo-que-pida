import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
export declare class InventoryService {
    private readonly inventoryRepository;
    constructor(inventoryRepository: Repository<Inventory>);
    create(input: CreateInventoryInput): Promise<Inventory>;
    findAll(): Promise<Inventory[]>;
    findOne(id: string): Promise<Inventory>;
    update(id: string, input: UpdateInventoryInput): Promise<Inventory>;
    remove(id: string): Promise<boolean>;
}
