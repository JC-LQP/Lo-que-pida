import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { ShippingInfo } from '../../shipping-info/entities/shipping-info.entity';

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

  @Field(() => Customer, { nullable: true })
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Field(() => Payment, { nullable: true })
  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;

  @Field(() => ShippingInfo, { nullable: true })
  @OneToOne(() => ShippingInfo, (shippingInfo) => shippingInfo.order)
  shippingInfo?: ShippingInfo;

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
