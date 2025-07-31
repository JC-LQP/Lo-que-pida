import { Seller } from '../../sellers/entities/seller.entity';
import { Address } from '../../addresses/entities/address.entity';
export declare class Warehouse {
    id: string;
    seller: Seller;
    address: Address;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
