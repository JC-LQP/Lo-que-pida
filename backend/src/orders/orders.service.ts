import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Order } from './entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(input: CreateOrderInput): Promise<Order> {
    // Load the customer entity
    const customer = await this.customersRepository.findOne({
      where: { id: input.customerId },
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${input.customerId}" not found`);
    }

    // Create the order with the loaded customer entity
    const order = this.ordersRepository.create({
      ...input,
      customer,
    });
    
    const savedOrder = await this.ordersRepository.save(order);
    
    // Return the order with loaded relations
    const orderWithRelations = await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'items', 'items.product'],
    });
    
    if (!orderWithRelations) {
      throw new NotFoundException(`Order with ID "${savedOrder.id}" not found after creation`);
    }
    
    return orderWithRelations;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      relations: ['customer', 'items', 'items.product'],
    });
    
    // Filter out orders without customers for now, or return all
    // You can choose to return all orders or only ones with customers
    return orders; // This will now work since customer is nullable
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: string, input: UpdateOrderInput): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, input);
    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<Order> {
    const order = await this.findOne(id);
    return this.ordersRepository.remove(order);
  }

  // Helper method to clean up orders without customers
  async cleanupInvalidOrders(): Promise<void> {
    const ordersWithoutCustomers = await this.ordersRepository.find({
      where: { customer: IsNull() },
    });
    
    if (ordersWithoutCustomers.length > 0) {
      await this.ordersRepository.remove(ordersWithoutCustomers);
      console.log(`Removed ${ordersWithoutCustomers.length} orders without customers`);
    }
  }
}
