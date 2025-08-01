import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
export declare class WarehouseResolver {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
    createWarehouse(input: CreateWarehouseInput): Promise<Warehouse>;
    findAll(): Promise<Warehouse[]>;
    findOne(id: string): Promise<Warehouse | null>;
    updateWarehouse(input: UpdateWarehouseInput): Promise<Warehouse | null>;
    removeWarehouse(id: string): Promise<boolean>;
}
