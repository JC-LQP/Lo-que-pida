import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Address } from '../addresses/entities/address.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
export declare class WarehouseService {
    private warehouseRepository;
    private sellerRepository;
    private addressRepository;
    constructor(warehouseRepository: Repository<Warehouse>, sellerRepository: Repository<Seller>, addressRepository: Repository<Address>);
    create(input: CreateWarehouseInput): Promise<Warehouse>;
    findAll(): Promise<Warehouse[]>;
    findOne(id: string): Promise<Warehouse | null>;
    update(id: string, input: UpdateWarehouseInput): Promise<Warehouse | null>;
    remove(id: string): Promise<boolean>;
}
