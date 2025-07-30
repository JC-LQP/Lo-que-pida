import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async create(input: CreateSellerInput): Promise<Seller> {
    const seller = this.sellerRepository.create(input);
    return this.sellerRepository.save(seller);
  }

  async findAll(): Promise<Seller[]> {
    return this.sellerRepository.find({ relations: ['user', 'subscription'] });
  }

  async findOne(id: string): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['user', 'subscription'],
    });

    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);
    return seller;
  }

  async update(id: string, input: UpdateSellerInput): Promise<Seller> {
    const seller = await this.findOne(id);
    const updated = Object.assign(seller, input);
    return this.sellerRepository.save(updated);
  }

  async remove(id: string): Promise<Seller> {
    const seller = await this.findOne(id);
    await this.sellerRepository.remove(seller);
    return { ...seller, id };
  }
}
