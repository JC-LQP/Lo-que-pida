import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
@Entity({ name: 'orders' })
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Customer)
  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
