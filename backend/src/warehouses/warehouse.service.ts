import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Address } from '../addresses/entities/address.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(input: CreateWarehouseInput) {
    const seller = await this.sellerRepository.findOne({ where: { id: input.sellerId } });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${input.sellerId} not found`);
    }

    const address = await this.addressRepository.findOne({ where: { id: input.addressId } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${input.addressId} not found`);
    }

    const warehouse = this.warehouseRepository.create({
      ...input,
      seller,
      address,
    });

    return this.warehouseRepository.save(warehouse);
  }

  findAll() {
    return this.warehouseRepository.find({
      relations: ['seller', 'address'],
    });
  }

  findOne(id: string) {
    return this.warehouseRepository.findOne({
      where: { id },
      relations: ['seller', 'address'],
    });
  }

  async update(id: string, input: UpdateWarehouseInput) {
    await this.warehouseRepository.update(id, input);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const warehouse = await this.findOne(id);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse #${id} not found`);
    }
    await this.warehouseRepository.remove(warehouse);
    return true;
  }
}
