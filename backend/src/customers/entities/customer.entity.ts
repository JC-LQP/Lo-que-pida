import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

/**
 * La entidad Customer representa a un cliente registrado en el marketplace.
 * Se relaciona con un User, múltiples direcciones y órdenes.
 */
@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Address, (address) => address.customer)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
