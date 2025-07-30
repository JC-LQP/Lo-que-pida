import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity({ name: 'order_items' })
export class OrderItem {
  @Field()
  @PrimaryColumn('uuid', { name: 'order_id' })
  orderId: string;

  @Field()
  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: string;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field()
  @Column('int')
  quantity: number;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;
}
