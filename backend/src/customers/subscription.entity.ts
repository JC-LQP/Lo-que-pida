import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
}

/* The `Subscription` class represents a subscription entity with properties such as id, customer,
status, and expiration date. */
@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.INACTIVE })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
  expiresAt: Date;
}
