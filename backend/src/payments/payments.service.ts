import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(input: CreatePaymentInput): Promise<Payment> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id: input.orderId },
    });

    const payment = this.paymentRepository.create({
      order,
      provider: input.provider,
      transactionId: input.transactionId,
    });

    return this.paymentRepository.save(payment);
  }
}
