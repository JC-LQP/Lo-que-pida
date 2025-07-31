import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Address } from '../../addresses/entities/address.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

/**
 * La entidad Customer representa a un cliente registrado en el marketplace.
 * Se relaciona con un User, múltiples direcciones y órdenes.
 */
@ObjectType()
@Entity({ name: 'customers' })
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Don't expose User directly, use field resolvers instead
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Don't expose internal timestamps directly
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Don't expose complex relationships directly, these would be separate queries
  @OneToMany(() => Address, (address) => address.customer)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  // These fields are resolved by field resolvers in the resolver
  @Field(() => String)
  email: string;

  @Field(() => String)
  fullName: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;
}
