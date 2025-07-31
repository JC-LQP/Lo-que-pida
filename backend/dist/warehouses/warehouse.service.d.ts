import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
export declare class WarehouseService {
    private warehouseRepository;
    constructor(warehouseRepository: Repository<Warehouse>);
    create(input: CreateWarehouseInput): Promise<CreateWarehouseInput & Warehouse>;
    findAll(): Promise<Warehouse[]>;
    findOne(id: string): Promise<Warehouse | null>;
    update(id: string, input: UpdateWarehouseInput): Promise<Warehouse | null>;
    remove(id: string): Promise<boolean>;
}
