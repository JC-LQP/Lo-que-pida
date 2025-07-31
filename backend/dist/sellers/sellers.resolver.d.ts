import { SellersService } from './sellers.service';
import { Seller } from './entities/seller.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
export declare class SellersResolver {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    createSeller(input: CreateSellerInput): Promise<Seller>;
    findAll(): Promise<Seller[]>;
    findOne(id: string): Promise<Seller>;
    updateSeller(input: UpdateSellerInput): Promise<Seller>;
    removeSeller(id: string): Promise<Seller>;
}
