import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';

/* The `export enum OrderStatus { ... }` block is defining an enumeration in TypeScript called
`OrderStatus`. An enumeration is a set of named constant values. In this case, `OrderStatus` has
four possible values: `PENDING`, `IN_PROCESS`, `SHIPPED`, and `DELIVERED`, each associated with a
string value. */
export enum OrderStatus {
  PENDING = 'pending',
  IN_PROCESS = 'in_process',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

/* The Order class represents an entity with properties such as id, customer, totalAmount, status, and
createdAt. */
@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
