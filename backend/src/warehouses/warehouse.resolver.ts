import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Mutation(() => Warehouse)
  createWarehouse(@Args('createWarehouseInput') input: CreateWarehouseInput) {
    return this.warehouseService.create(input);
  }

  @Query(() => [Warehouse], { name: 'warehouses' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Query(() => Warehouse, { name: 'warehouse' })
  findOne(@Args('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Mutation(() => Warehouse)
  updateWarehouse(@Args('updateWarehouseInput') input: UpdateWarehouseInput) {
    return this.warehouseService.update(input.id, input);
  }

  @Mutation(() => Warehouse)
  removeWarehouse(@Args('id') id: string) {
    return this.warehouseService.remove(id);
  }
}
