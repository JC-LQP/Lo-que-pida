import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { registerEnumType, ObjectType, Field, ID } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentProvider {
  STRIPE = 'stripe',
  KUSHKI = 'kushki',
  LOCAL = 'local',
}

registerEnumType(PaymentProvider, {
  name: 'PaymentProvider',
});

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
@Entity({ name: 'payments' })
export class Payment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Order)
  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Field(() => PaymentProvider)
  @Column({ type: 'enum', enum: PaymentProvider })
  provider: PaymentProvider;

  @Field(() => PaymentStatus)
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Field({ nullable: true })
  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
