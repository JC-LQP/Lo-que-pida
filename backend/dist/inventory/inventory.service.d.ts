import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
export declare class InventoryService {
    private readonly inventoryRepository;
    private readonly categoryRepository;
    constructor(inventoryRepository: Repository<Inventory>, categoryRepository: Repository<Category>);
    create(input: CreateInventoryInput): Promise<Inventory>;
    findAll(): Promise<Inventory[]>;
    findOne(id: string): Promise<Inventory>;
    update(id: string, input: UpdateInventoryInput): Promise<Inventory>;
    remove(id: string): Promise<boolean>;
}
