import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(input: CreateInventoryInput): Promise<Inventory> {
    const category = await this.categoryRepository.findOneBy({ id: input.categoryId });
    if (!category) {
      throw new NotFoundException(`Category with ID ${input.categoryId} not found`);
    }

    const inventory = this.inventoryRepository.create({
      ...input,
      category,
    });

    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['products', 'category'],
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['products', 'category'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async update(id: string, input: UpdateInventoryInput): Promise<Inventory> {
    const inventory = await this.findOne(id);

    if (input.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: input.categoryId });
      if (!category) {
        throw new NotFoundException(`Category with ID ${input.categoryId} not found`);
      }
      inventory.category = category;
    }

    Object.assign(inventory, input);
    return this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.inventoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
