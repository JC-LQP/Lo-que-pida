import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

/* The OrderItem class represents an entity for order items with properties such as orderId, productId,
quantity, unitPrice, and relationships with Order and Product entities. */
@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryColumn('uuid', { name: 'order_id' })
  orderId: string;

  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;
}
