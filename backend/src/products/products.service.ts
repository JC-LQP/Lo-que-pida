import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Seller } from '../sellers/entities/seller.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const seller = await this.sellerRepository.findOneBy({ id: createProductInput.sellerId });
    if (!seller) throw new NotFoundException('Seller not found');

    const product = this.productRepository.create({
      ...createProductInput,
      seller,
    });

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['seller'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.productRepository.preload({
      id,
      ...updateProductInput,
    });

    if (!product) throw new NotFoundException('Product not found');

    if (updateProductInput.sellerId) {
      const seller = await this.sellerRepository.findOneBy({ id: updateProductInput.sellerId });
      if (!seller) throw new NotFoundException('Seller not found');
      product.seller = seller;
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }
}
