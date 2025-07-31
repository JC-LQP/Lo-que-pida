import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity({ name: 'cart_items' })
export class CartItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  product: Product;

  @Field()
  @Column({ type: 'int', default: 1 })
  quantity: number;
}
