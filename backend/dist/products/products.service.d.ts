import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Seller } from '../sellers/entities/seller.entity';
export declare class ProductsService {
    private productRepository;
    private sellerRepository;
    constructor(productRepository: Repository<Product>, sellerRepository: Repository<Seller>);
    create(createProductInput: CreateProductInput): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductInput: UpdateProductInput): Promise<Product>;
    remove(id: string): Promise<Product>;
}
