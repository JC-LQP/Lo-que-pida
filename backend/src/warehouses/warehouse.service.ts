import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  create(input: CreateWarehouseInput) {
    return this.warehouseRepository.save(input);
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

  async remove(id: string) {
    const warehouse = await this.findOne(id);
    return this.warehouseRepository.remove(warehouse);
  }
}
