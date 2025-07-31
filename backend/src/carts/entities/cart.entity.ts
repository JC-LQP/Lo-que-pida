import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Customer } from '../../customers/entities/customer.entity';
import { CartItem } from './cart-item.entity';

@ObjectType()
@Entity({ name: 'carts' })
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Customer)
  @ManyToOne(() => Customer, { nullable: false, onDelete: 'CASCADE' })
  customer: Customer;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
