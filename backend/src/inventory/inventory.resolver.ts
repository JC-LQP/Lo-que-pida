import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => Inventory)
  createInventory(@Args('input') input: CreateInventoryInput): Promise<Inventory> {
    return this.inventoryService.create(input);
  }

  @Query(() => [Inventory])
  findAllInventory(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Query(() => Inventory)
  findOneInventory(@Args('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Mutation(() => Inventory)
  updateInventory(
    @Args('id') id: string,
    @Args('input') input: UpdateInventoryInput,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeInventory(@Args('id') id: string): Promise<boolean> {
    return this.inventoryService.remove(id);
  }
}
