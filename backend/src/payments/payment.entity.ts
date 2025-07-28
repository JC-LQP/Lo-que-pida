import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';

/* The `export enum PaymentProvider` is defining an enumeration in TypeScript called `PaymentProvider`.
This enum specifies the possible payment providers that can be associated with a payment entity. In
this case, the enum has three members: `STRIPE`, `KUSHKI`, and `LOCAL`, each with a corresponding
string value ('stripe', 'kushki', 'local'). */
export enum PaymentProvider {
  STRIPE = 'stripe',
  KUSHKI = 'kushki',
  LOCAL = 'local',
}

/* The `export enum PaymentStatus` is defining an enumeration in TypeScript for the possible status
values of a payment. In this case, the `PaymentStatus` enum has three members: `PENDING`, `PAID`,
and `FAILED`, each with a corresponding string value ('pending', 'paid', 'failed'). */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

/* The class `Payment` represents a payment entity with properties such as id, order, provider, status,
transactionId, and createdAt. */
@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider: PaymentProvider;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
