import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(input: CreateInventoryInput): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(input);
    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async update(id: string, input: UpdateInventoryInput): Promise<Inventory> {
    const inventory = await this.findOne(id);
    Object.assign(inventory, input);
    return this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.inventoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
