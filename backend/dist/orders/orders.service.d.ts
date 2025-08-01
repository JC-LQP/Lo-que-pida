import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
export declare class OrdersService {
    private ordersRepository;
    private customersRepository;
    constructor(ordersRepository: Repository<Order>, customersRepository: Repository<Customer>);
    create(input: CreateOrderInput): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, input: UpdateOrderInput): Promise<Order>;
    remove(id: string): Promise<Order>;
    cleanupInvalidOrders(): Promise<void>;
}
