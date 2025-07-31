import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { User } from '../users/entities/user.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
export declare class SellersService {
    private readonly sellerRepository;
    private readonly userRepository;
    constructor(sellerRepository: Repository<Seller>, userRepository: Repository<User>);
    create(input: CreateSellerInput): Promise<Seller>;
    findAll(): Promise<Seller[]>;
    findOne(id: string): Promise<Seller>;
    update(id: string, input: UpdateSellerInput): Promise<Seller>;
    remove(id: string): Promise<Seller>;
}
