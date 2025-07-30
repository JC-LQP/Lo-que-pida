import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@Args('input') input: CreateOrderInput): Promise<Order> {
    return this.ordersService.create(input);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  updateOrder(@Args('input') input: UpdateOrderInput): Promise<Order> {
    return this.ordersService.update(input.id, input);
  }

  @Mutation(() => Order)
  removeOrder(@Args('id', { type: () => String }) id: string): Promise<Order> {
    return this.ordersService.remove(id);
  }
}
