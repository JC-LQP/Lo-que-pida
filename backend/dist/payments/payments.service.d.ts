import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { Order } from '../orders/entities/order.entity';
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly orderRepository;
    constructor(paymentRepository: Repository<Payment>, orderRepository: Repository<Order>);
    create(input: CreatePaymentInput): Promise<Payment>;
}
